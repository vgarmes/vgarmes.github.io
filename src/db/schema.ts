import {
	sqliteTable,
	text,
	integer,
	uniqueIndex,
	primaryKey
} from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable(
	'posts',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		slug: text('slug').notNull(),
		totalLikes: integer('total_likes').default(0),
		totalViews: integer('total_views').default(0)
	},
	table => ({
		slugIdx: uniqueIndex('slugIdx').on(table.slug)
	})
)

export const userLikes = sqliteTable(
	'user_likes',
	{
		userId: text('user_id'),
		postId: integer('post_id').references(() => posts.id),
		likes: integer('likes').default(1)
	},
	table => {
		return {
			pk: primaryKey(table.userId, table.postId)
		}
	}
)
