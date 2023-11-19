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

app.get('/api/posts/:slug/stats', async c => {
	const db = drizzle(c.env.DB)
	const slug = c.req.param('slug')
	const ipAddress = c.req.header('cf-connecting-ip') || '0.0.0.0'
	const salt = c.env.IP_ADDRESS_SALT
	const currentUserId = await hashIpAddress(ipAddress, salt)
	const post = await db.select().from(posts).where(eq(posts.slug, slug)).get()

	if (!post) {
		return c.text('Post not found in database', 404)
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
		totalViews: post.totalViews,
		totalLikes: post.totalLikes,
		userLikes: currentUserLikes?.likes ?? 0
	})
})

app.post('/api/posts/:slug/view', async c => {
	const db = drizzle(c.env.DB)
	const slug = c.req.param('slug')
	await db
		.insert(posts)
		.values({ slug, totalViews: 1 })
		.onConflictDoUpdate({
			target: posts.slug,
			set: { totalViews: sql`total_views + 1` }
		})
		.run()

	return c.text('success', 201)
})

app.post('/api/posts/:slug/like', async c => {
	const data = await c.req.json()
	const { count } = data

	if (typeof count !== 'number' || count > MAX_LIKES_PER_USER || count < 0) {
		return c.text('Likes value not valid', 400)
	}

	const db = drizzle(c.env.DB)
	const ipAddress = c.req.header('cf-connecting-ip') || '0.0.0.0'
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

	// this could be a transaction but it's not yet compatible with D1
	const updatedPost = await db
		.insert(posts)
		.values({ slug, totalLikes: likesIncrement })
		.onConflictDoUpdate({
			target: posts.slug,
			set: { totalLikes: sql`total_likes + ${likesIncrement}` }
		})
		.returning()
		.get()

	const updatedUserLikes = await db
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

	return c.json({
		totalLikes: updatedPost.totalLikes,
		userLikes: updatedUserLikes.likes,
		userId: updatedUserLikes.userId,
		postId: updatedPost.id
	})
})

export default app
