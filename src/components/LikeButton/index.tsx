// Based on the LikeButton by Delba Oliveira: https://github.com/delbaoliveira
import { useEffect, useRef, useState } from 'preact/hooks'
import cx from 'clsx'
import './styles.css'
import Confetti from './Confetti'
import type { FunctionalComponent } from 'preact'
import { LoadingDots } from './LoadingDots'

interface Props {
	slug: string
}

const apiHost = import.meta.env.PUBLIC_API_HOST

const LikeButton: FunctionalComponent<Props> = ({ slug }) => {
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
			const response = await fetch(`${apiHost}/api/posts/${slug}/user-stats`)
			if (response.status !== 200) {
				setStatus('error')
				return
			}
			const data = await response.json<{
				totalLikes: number
				userLikes: number
			}>()

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
		<div className="flex items-center gap-2">
			<div className="relative flex">
				<button
					className={cx(
						'relative transform overflow-hidden rounded-lg bg-gradient-to-tl from-zinc-300 to-zinc-100 p-1 transition-all duration-300 ease-out enabled:hover:scale-110 enabled:active:scale-90 dark:from-white/5 dark:to-white/30 ',
						{ 'animate-pulse': status === 'loading' }
					)}
					disabled={status === 'loading' || reachedMaxLikes}
					onClick={handleClick}
				>
					<div
						className={cx(
							'absolute inset-0 transform-gpu bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 transition-transform',
							{
								'translate-y-full': userLikes === 0,
								'translate-y-5': userLikes === 1,
								'translate-y-3': userLikes === 2
							}
						)}
					></div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className={cx(
							'relative h-6 w-6 fill-zinc-700 group-hover:scale-110 dark:fill-white',
							{
								'[animation:animateHeart_0.3s_linear_forwards_0.25s] ':
									likes === 3,
								'scale-[0.2]': likes === 3
							}
						)}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						/>
					</svg>
				</button>
				<Confetti active={reachedMaxLikes} />
			</div>
			<div className="text-sm font-bold">
				{status === 'loading' ? (
					<LoadingDots />
				) : (
					<span
						className={cx({
							'text-pink-600 dark:text-pink-500': userLikes > 0
						})}
					>
						{likes} likes
					</span>
				)}
			</div>
		</div>
	)
}

export default LikeButton
