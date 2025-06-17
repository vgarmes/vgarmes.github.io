import { useState, useEffect } from 'preact/hooks'
import PostLikes from './PostLikes'

interface Props {
	slug: string
}

const apiHost = import.meta.env.PUBLIC_API_HOST

const PostStats = ({ slug }: Props) => {
	const [likes, setLikes] = useState(0)
	const [userLikes, setUserLikes] = useState(0)
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
			}

			setLikes(data.totalLikes)
			setUserLikes(data.userLikes)
			setStatus('success')
		}

		const incrementViews = () =>
			fetch(`${apiHost}/api/posts/${slug}/view`, { method: 'POST' })

		fetchStats().then(() => incrementViews())
	}, [])

	return (
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
	)
}

export default PostStats
