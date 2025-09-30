import type { FunctionalComponent } from 'preact'
import { useEffect, useRef, useState, type ReactNode } from 'preact/compat'
import styles from './sparkling-text.module.css'

interface Props {
	children?: ReactNode
	alwaysAnimate?: boolean
	frequency?: number
}

function randomInRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const SparklingText: FunctionalComponent<Props> = ({
	children,
	alwaysAnimate = false,
	frequency = 250
}) => {
	const [shouldAnimate, setShouldAnimate] = useState(alwaysAnimate)

	const sparkles = useRef<Array<HTMLSpanElement | null>>([null, null, null])
	sparkles.current = []

	useEffect(() => {
		const isHoverUnsupported = window.matchMedia('(hover: none)').matches

		if (isHoverUnsupported) {
			setShouldAnimate(true)
		}
	}, [])

	useEffect(() => {
		if (!shouldAnimate) return
		let index = 0

		const interval = setInterval(() => {
			const sparkleRef = sparkles.current[index]

			if (sparkleRef) {
				// Random positions between -20% and 80%
				const left = randomInRange(-20, 80) + '%'
				const top = randomInRange(-20, 80) + '%'

				// Apply new style
				sparkleRef.style.left = left
				sparkleRef.style.top = top
				sparkleRef.style.opacity = '1'

				// Retrigger CSS animation by toggling attribute
				sparkleRef.removeAttribute('animate')
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				sparkleRef.offsetWidth // force reflow to ensure the animation can be retriggered
				sparkleRef.setAttribute('animate', '1')
			}

			// move to next sparkle
			index = (index + 1) % sparkles.current.length
		}, frequency)

		return () => clearInterval(interval)
	}, [shouldAnimate, frequency])

	return (
		<span
			class={styles.sparkle__container}
			onPointerEnter={() => !alwaysAnimate && setShouldAnimate(true)}
			onPointerLeave={() => !alwaysAnimate && setShouldAnimate(false)}
		>
			{Array.from({ length: 3 }).map((_, index) => (
				<span
					class={styles.sparkle__sparkle}
					key={index}
					ref={r => (sparkles.current[index] = r)}
				>
					<svg width="20" height="20" viewBox="0 0 68 68" fill="#8253D5">
						<path d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"></path>
					</svg>
				</span>
			))}

			<span style={{ color: 'unset' }} class={styles.sparkle__text}>
				{children}
			</span>
		</span>
	)
}

export default SparklingText
