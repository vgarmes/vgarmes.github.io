import LikeButton from '~/components/LikeButton'
import { useEffect, useState } from 'preact/hooks'

const LikeButtonDemo = () => {
	const [likes, setLikes] = useState(0)

	useEffect(() => {
		if (likes < 3) return
		const timeout = setTimeout(() => {
			setLikes(0)
		}, 3000)

		return () => clearTimeout(timeout)
	}, [likes])

	const handleClick = () => {
		if (likes >= 3) {
			return
		}

		setLikes(likes + 1)
	}

	return (
		<LikeButton
			likes={likes}
			userLikes={likes}
			onClick={handleClick}
			disabled={likes >= 3}
		/>
	)
}

export default LikeButtonDemo
