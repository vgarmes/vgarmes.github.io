import LikeButton from '.'
import { useState, useRef } from 'preact/hooks'

const LikeButtonDemo = () => {
	const [likes, setLikes] = useState(0)
	const direction = useRef<'up' | 'down'>('up')

	const handleClick = () => {
		if (likes >= 3) {
			direction.current = 'down'
		} else if (likes === 0) {
			direction.current = 'up'
		}
		const increment = direction.current === 'up' ? 1 : -1
		setLikes(likes + increment)
	}

	return <LikeButton likes={likes} onClick={handleClick} />
}

export default LikeButtonDemo
