import type { FunctionComponent } from 'preact'
import LikeButton from './LikeButton'
import { useState, useEffect, useRef } from 'preact/hooks'

interface Props {
	slug: string
}

const apiHost = import.meta.env.PUBLIC_API_HOST

const PostLikes: FunctionComponent<Props> = ({ slug }) => {
	const [likes, setLikes] = useState(0)
	const [userLikes, setUserLikes] = useState(0)
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading'
	)
	const incrementLikes = useRef(0)
	const reachedMaxLikes = userLikes >= 3

	const handleClick = () => {
		if (reachedMaxLikes) {
			return
		}

		setUserLikes(userLikes + 1)
		incrementLikes.current += 1
		setLikes(likes + 1)
	}

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

		fetchStats()
	}, [])

	useEffect(() => {
		// Debounced post request
		if (incrementLikes.current === 0) {
			return
		}
		function likePost() {
			fetch(`${apiHost}/api/posts/${slug}/like`, {
				method: 'POST',
				body: JSON.stringify({ count: incrementLikes.current })
			})
			incrementLikes.current = 0
		}
		const timeoutId = setTimeout(likePost, 1000)
		return () => clearTimeout(timeoutId)
	}, [userLikes])

	return (
		<LikeButton
			likes={likes}
			disabled={status === 'loading' || reachedMaxLikes}
			isLoading={status === 'loading'}
			onClick={handleClick}
		/>
	)
}

export default PostLikes
