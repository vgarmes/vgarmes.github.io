import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { posts, userLikes } from '~/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { hashIpAddress } from './utils'

type Bindings = {
	DB: D1Database
	IP_ADDRESS_SALT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/health', async c => {
	if (c.env.IP_ADDRESS_SALT) {
		return c.text('salt is defined')
	}
	return c.text('Yay! Api working!!')
})

app.get('/api/test', async c => {
	const { results } = await c.env.DB.prepare(
		`
    select * from posts
  `
	).all()
	return c.json(results)
})
app.post('/api/test', async c => {
	const { success } = await c.env.DB.prepare(
		`
    insert into posts (slug,likes) values (?, ?)
  `
	)
		.bind('test-post', 24)
		.run()

	if (success) {
		c.status(201)
		return c.text('Created')
	} else {
		c.status(500)
		return c.text('Something went wrong')
	}
})
app.get('/api/posts/:slug/likes', async c => {
	const db = drizzle(c.env.DB)
	const slug = c.req.param('slug')
	const ipAddress = c.req.header('x-forwarded-for') || '0.0.0.0'
	const salt = c.env.IP_ADDRESS_SALT
	const currentUserId = await hashIpAddress(ipAddress, salt)
	const post = await db.select().from(posts).where(eq(posts.slug, slug)).get()
	const currentUserLikes = await db
		.select()
		.from(userLikes)
		.where(
			and(eq(userLikes.postId, post.id), eq(userLikes.userId, currentUserId))
		)
		.get()
	return c.json({
		slug: post.slug,
		totaLikes: post.likes,
		userLikes: currentUserLikes.likes,
		userId: currentUserLikes.userId
	})
})

app.post('/api/posts/:slug/likes', async c => {
	const data = await c.req.json()
	const { count } = data
	const db = drizzle(c.env.DB)
	const ipAddress = c.req.header('x-forwarded-for') || '0.0.0.0'
	const slug = c.req.param('slug')
	const salt = c.env.IP_ADDRESS_SALT
	const currentUserId = await hashIpAddress(ipAddress, salt)

	const result = await db.transaction(async tx => {
		const updatedPost = await tx
			.insert(posts)
			.values({ slug, likes: count })
			.onConflictDoUpdate({
				target: posts.slug,
				set: { likes: sql`likes + ${count}` }
			})
			.returning()
			.get()

		const updatedUserLikes = await tx
			.insert(userLikes)
			.values({ userId: currentUserId, postId: updatedPost.id, likes: count })
			.onConflictDoUpdate({
				target: [userLikes.userId, userLikes.postId],
				set: { likes: sql`likes + ${count}` }
			})
			.returning()
			.get()

		return { totalLikes: updatedPost.likes, userLikes: updatedUserLikes.likes }
	})

	return c.json(result)
})

export default app
