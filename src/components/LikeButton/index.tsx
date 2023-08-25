import { useState } from 'preact/hooks'
import cx from 'clsx'
import './styles.css'
import Confetti from './Confetti'

const LikeButton = () => {
	const [likes, setLikes] = useState(0)
	const handleClick = () => (likes === 3 ? setLikes(0) : setLikes(likes + 1))

	return (
		<div className="relative flex">
			<button
				className="relative overflow-hidden rounded-lg bg-gradient-to-tl from-white/5 to-white/30 p-1 transition-all duration-300 ease-out hover:scale-110 active:scale-90"
				onClick={handleClick}
			>
				<div
					className={cx(
						'absolute inset-0 transform-gpu bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 transition-transform',
						{
							'translate-y-8': likes === 0,
							'translate-y-5': likes === 1,
							'translate-y-3': likes === 2
						}
					)}
				></div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={cx('relative h-6 w-6 group-hover:scale-110', {
						'[animation:animateHeart_0.3s_linear_forwards_0.25s]': likes === 3,
						'scale-[0.2]': likes === 3
					})}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
					/>
				</svg>
			</button>
			<Confetti active={likes === 3} />
		</div>
	)
}

export default LikeButton
