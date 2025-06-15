import { useState, useEffect } from 'preact/hooks'
import PostLikes from './PostLikes'
import { LoadingDots } from './LoadingDots'
interface Props {
	slug: string
}

const apiHost = import.meta.env.PUBLIC_API_HOST

const PostStats = ({ slug }: Props) => {
	const [likes, setLikes] = useState(0)
	const [userLikes, setUserLikes] = useState(0)
	const [views, setViews] = useState(0)
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading'
	)
	useEffect(() => {
		const fetchStats = async () => {
			const response = await fetch(`${apiHost}/api/posts/${slug}/stats`)
			if (response.status !== 200) {
				setStatus('error')
				return
			}
			const data = (await response.json()) as {
				totalLikes: number
				userLikes: number
				totalViews: number
			}

			setLikes(data.totalLikes)
			setUserLikes(data.userLikes)
			setViews(data.totalViews)
			setStatus('success')
		}

		const incrementViews = () =>
			fetch(`${apiHost}/api/posts/${slug}/view`, { method: 'POST' })

		fetchStats().then(() => incrementViews())
	}, [])

	return (
		<div className="flex items-center gap-6">
			<div className="flex items-center gap-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					className="h-4 w-4"
				>
					<line x1="18" x2="18" y1="20" y2="10" />
					<line x1="12" x2="12" y1="20" y2="4" />
					<line x1="6" x2="6" y1="20" y2="14" />
				</svg>
				{status === 'loading' ? (
					<LoadingDots />
				) : (
					`${views} ${views === 1 ? 'view' : 'views'}`
				)}
			</div>

			<PostLikes
				slug={slug}
				likes={likes}
				userLikes={userLikes}
				onLike={() => {
					setLikes(likes + 1)
					setUserLikes(userLikes + 1)
				}}
				isLoading={status === 'loading'}
			/>
		</div>
	)
}

export default PostStats
