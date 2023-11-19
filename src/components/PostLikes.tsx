import type { FunctionComponent } from 'preact'
import LikeButton from './LikeButton'
import { useEffect, useRef } from 'preact/hooks'

interface Props {
	slug: string
	likes?: number
	userLikes?: number
	isLoading?: boolean
	onLike: () => void
}

const apiHost = import.meta.env.PUBLIC_API_HOST

const PostLikes: FunctionComponent<Props> = ({
	slug,
	likes = 0,
	userLikes = 0,
	isLoading,
	onLike
}) => {
	const incrementLikes = useRef(0)
	const reachedMaxLikes = userLikes >= 3

	const handleClick = () => {
		if (reachedMaxLikes) {
			return
		}
		incrementLikes.current += 1
		onLike()
	}

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
			userLikes={userLikes}
			disabled={isLoading || reachedMaxLikes}
			isLoading={isLoading}
			onClick={handleClick}
		/>
	)
}

export default PostLikes
