import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { posts, userLikes } from '~/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { hashIpAddress } from './utils'
import { MAX_LIKES_PER_USER } from '~/constants'
import { cors } from 'hono/cors'

type Bindings = {
	DB: D1Database
	IP_ADDRESS_SALT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(
	'/api/*',
	cors({
		origin: '*',
		allowMethods: ['POST', 'GET', 'OPTIONS']
	})
)

app.get('/api/posts/:slug/user-stats', async c => {
	const db = drizzle(c.env.DB)
	const slug = c.req.param('slug')
	const ipAddress = c.req.header('x-forwarded-for') || '0.0.0.0'
	const salt = c.env.IP_ADDRESS_SALT
	const currentUserId = await hashIpAddress(ipAddress, salt)
	const post = await db.select().from(posts).where(eq(posts.slug, slug)).get()

	if (!post) {
		return c.json({
			slug,
			totalLikes: 0,
			userLikes: 0,
			totalViews: 0
		})
	}

	const currentUserLikes = await db
		.select()
		.from(userLikes)
		.where(
			and(eq(userLikes.postId, post.id), eq(userLikes.userId, currentUserId))
		)
		.get()

	return c.json({
		slug,
		totalViews: post.totalViews || 0,
		totalLikes: post.totalLikes || 0,
		userLikes: currentUserLikes?.likes || 0
	})
})

app.get('/api/posts/:slug/stats', async c => {
	const db = drizzle(c.env.DB)
	const slug = c.req.param('slug')
	const result = await db.select().from(posts).where(eq(posts.slug, slug)).get()

	return c.json({
		slug,
		totalLikes: result?.totalLikes || 0,
		totalViews: result?.totalViews || 0
	})
})
/* app.delete('/api', async c => {
	const db = drizzle(c.env.DB)
	await db.delete(userLikes).run()
	await db.delete(posts).run()
	return c.text('done')
}) */

app.post('/api/posts/:slug/view', async c => {
	const db = drizzle(c.env.DB)
	const slug = c.req.param('slug')
	const newStats = await db
		.insert(posts)
		.values({ slug, totalViews: 1 })
		.onConflictDoUpdate({
			target: posts.slug,
			set: { totalViews: sql`total_views + 1` }
		})
		.returning()
		.get()

	return c.json({ slug, views: newStats.totalViews })
})

app.post('/api/posts/:slug/like', async c => {
	const data = await c.req.json()
	const { count } = data

	if (typeof count !== 'number' || count > MAX_LIKES_PER_USER) {
		return c.text('Likes value not valid', 400)
	}

	const db = drizzle(c.env.DB)
	const ipAddress = c.req.header('x-forwarded-for') || '0.0.0.0'
	const slug = c.req.param('slug')
	const salt = c.env.IP_ADDRESS_SALT
	const currentUserId = await hashIpAddress(ipAddress, salt)

	const post = await db
		.select({
			userLikes: userLikes.likes
		})
		.from(userLikes)
		.leftJoin(posts, eq(posts.id, userLikes.postId))
		.where(and(eq(posts.slug, slug), eq(userLikes.userId, currentUserId)))
		.get()

	const currentUserLikes = post?.userLikes || 0

	if (currentUserLikes >= MAX_LIKES_PER_USER) {
		return c.text('Reached maximum number of allowed votes for this post', 400)
	}

	const likesIncrement = Math.min(count, MAX_LIKES_PER_USER - currentUserLikes)

	const result = await db.transaction(async tx => {
		const updatedPost = await tx
			.insert(posts)
			.values({ slug, totalLikes: likesIncrement })
			.onConflictDoUpdate({
				target: posts.slug,
				set: { totalLikes: sql`total_likes + ${likesIncrement}` }
			})
			.returning()
			.get()

		const updatedUserLikes = await tx
			.insert(userLikes)
			.values({
				userId: currentUserId,
				postId: updatedPost.id,
				likes: likesIncrement
			})
			.onConflictDoUpdate({
				target: [userLikes.userId, userLikes.postId],
				set: { likes: sql`likes + ${likesIncrement}` }
			})
			.returning()
			.get()

		return {
			totalLikes: updatedPost.totalLikes,
			userLikes: updatedUserLikes.likes,
			userId: updatedUserLikes.userId,
			postId: updatedPost.id
		}
	})

	return c.json(result)
})

export default app
