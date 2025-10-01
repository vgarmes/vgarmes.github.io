import type { FunctionalComponent } from 'preact'
import {
	type CSSProperties,
	useEffect,
	useState,
	type ReactNode
} from 'preact/compat'
import styles from './sparkling-text.module.css'

interface Props {
	children?: ReactNode
	alwaysAnimate?: boolean
	frequency?: number
}

function randomInRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

type Sparkle = { style: CSSProperties; createdAt: number }

function generateSparkle(): Sparkle {
	const left = randomInRange(-20, 120) + '%'
	const top = randomInRange(-20, 120) + '%'

	return { style: { left, top, opacity: 1 }, createdAt: Date.now() }
}

const SparklingText: FunctionalComponent<Props> = ({
	children,
	alwaysAnimate = false,
	frequency = 250
}) => {
	const [isAnimating, setIsAnimating] = useState(alwaysAnimate)
	const [sparkles, setSparkles] = useState<Sparkle[]>([])

	useEffect(() => {
		const isHoverUnsupported = window.matchMedia('(hover: none)').matches

		if (isHoverUnsupported) {
			setIsAnimating(true)
		}
	}, [])

	useEffect(() => {
		if (!isAnimating) return

		setSparkles([generateSparkle()])

		const interval = setInterval(() => {
			setSparkles(prev => [generateSparkle(), ...prev].slice(0, 3))
		}, frequency)

		return () => clearInterval(interval)
	}, [isAnimating, frequency])

	return (
		<span
			class={styles.sparkle__container}
			onPointerEnter={() => !alwaysAnimate && setIsAnimating(true)}
			onPointerLeave={() => !alwaysAnimate && setIsAnimating(false)}
		>
			{sparkles.map(sparkle => (
				<span
					key={sparkle.createdAt}
					class={styles.sparkle__sparkle}
					style={sparkle.style}
				>
					<svg width="20" height="20" viewBox="0 0 68 68" fill="#8253D5">
						<path d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"></path>
					</svg>
				</span>
			))}

			<span class={styles.sparkle__text}>{children}</span>
		</span>
	)
}

export default SparklingText
