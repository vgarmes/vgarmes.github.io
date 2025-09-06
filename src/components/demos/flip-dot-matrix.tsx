// Inspired by MotionGrid https://animate-ui.com/docs/components/motion-grid
// and this post by Adrien Griveau: https://x.com/Griveau/status/1932832554354163804

import type { ComponentPropsWithoutRef } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import { cn } from '~/util/cn'

type FrameDot = [number, number]
type Frame = FrameDot[]
type Frames = Frame[]

type FlipDotGridProps = {
	gridSize: [number, number]
	frames: Frames
	duration?: number
	animate?: boolean
	cellClassName?: string
	cellProps?: ComponentPropsWithoutRef<'div'>
	cellActiveClassName?: string
	cellInactiveClassName?: string
} & ComponentPropsWithoutRef<'div'>

const FlipDotGrid = ({
	gridSize,
	frames,
	duration = 200,
	animate = true,
	cellClassName,
	cellProps,
	cellActiveClassName,
	cellInactiveClassName,
	className,
	...props
}: FlipDotGridProps) => {
	const [index, setIndex] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (!animate || frames.length === 0) return
		intervalRef.current = setInterval(
			() => setIndex(i => (i + 1) % frames.length),
			duration
		)
		return () => clearInterval(intervalRef.current!)
	}, [frames.length, duration, animate])

	const [cols, rows] = gridSize

	const active = new Set<number>(
		frames[index]?.map(([x, y]) => y * cols + x) ?? []
	)

	return (
		<div
			className={cn('grid w-fit gap-0.5', className)}
			style={{
				gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
				gridAutoRows: '1fr'
			}}
			{...props}
		>
			{Array.from({ length: cols * rows }).map((_, i) => (
				<div
					key={i}
					className={cn(
						'aspect-square size-3 rounded-full',
						active.has(i)
							? cn('bg-primary scale-110', cellActiveClassName)
							: cn('bg-muted scale-100', cellInactiveClassName),
						cellClassName
					)}
					{...cellProps}
				/>
			))}
		</div>
	)
}

export {
	FlipDotGrid,
	type FlipDotGridProps,
	type FrameDot,
	type Frame,
	type Frames
}
