import type { FunctionalComponent } from 'preact'
import type { CSSProperties } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'

const TABS = [
	'Overview',
	'Deployments',
	'Analytics',
	'Logs',
	'Observability',
	'Settings'
]

function getTabUnderlineStyle(item: HTMLLIElement) {
	return {
		transform: `translateX(${item.offsetLeft}px) scaleX(${item.offsetWidth / 100})`,
		display: 'block'
	}
}

const AnimatedTabs: FunctionalComponent = () => {
	const [isFirstHover, setIsFirstHover] = useState(true)
	const itemsRef = useRef<Map<number, HTMLLIElement | null>>(null)

	const [tabUnderlineStyle, setTabUnderlineStyle] = useState<
		CSSProperties | undefined
	>(undefined)
	const [backdropStyle, setBackdropStyle] = useState<CSSProperties | undefined>(
		undefined
	)

	function getMap() {
		if (!itemsRef.current) {
			// Initialize the Map on first usage.
			itemsRef.current = new Map()
		}
		return itemsRef.current
	}

	useEffect(() => {
		const firstItem = itemsRef.current?.get(0)

		if (!firstItem) return

		// initial tab underline position
		setTabUnderlineStyle(getTabUnderlineStyle(firstItem))
	}, [])

	return (
		<div className="not-prose flex min-h-40 items-center justify-center p-2">
			<nav
				id="animated-tabs"
				className="text-muted-foreground scrollbar-none shadow-border relative overflow-x-auto shadow-[inset_0_-1px]"
			>
				<ul
					className="[&>li>button]:hover:text-foreground flex items-center pb-2 text-sm [&>li>button]:inline-block [&>li>button]:cursor-pointer [&>li>button]:px-3 [&>li>button]:py-1 [&>li>button]:text-current [&>li>button]:transition-colors"
					onMouseLeave={() => {
						setIsFirstHover(true)
						setBackdropStyle({
							opacity: 0,
							visibility: 'hidden',
							'--transition-duration': '0ms'
						})
					}}
				>
					{TABS.map((tab, index) => (
						<li
							key={tab}
							ref={node => {
								const map = getMap()
								map.set(index, node)

								return () => {
									map.delete(index)
								}
							}}
							onClick={e => {
								setTabUnderlineStyle(getTabUnderlineStyle(e.currentTarget))
							}}
							onMouseEnter={e => {
								setBackdropStyle({
									'--top': `${e.currentTarget.offsetTop}px`,
									'--left': `${e.currentTarget.offsetLeft}px`,
									'--width': `${e.currentTarget.offsetWidth}px`,
									'--height': `${e.currentTarget.offsetHeight}px`,
									opacity: 1,
									visibility: 'visible',
									...(!isFirstHover && { '--transition-duration': '250ms' })
								})
								if (isFirstHover) {
									setIsFirstHover(false)
								}
							}}
						>
							<button>{tab}</button>
						</li>
					))}
				</ul>
				<div
					id="menu-backdrop"
					style={backdropStyle}
					className="absolute top-0 left-0 -z-10 h-(--height) w-(--width) translate-x-(--left) translate-y-(--top) rounded bg-gray-300 opacity-0 transition-[opacity,_translate,_width,_height] duration-[250ms,_var(--transition-duration,_0ms),_var(--transition-duration,_0ms),_var(--transition-duration,_0ms)] ease-in-out"
				></div>
				<div
					id="tab-underline"
					className="bg-foreground absolute bottom-0 left-0 z-10 hidden h-[2px] w-[100px] origin-[0_0_0] transition-transform"
					style={tabUnderlineStyle}
				></div>
			</nav>
		</div>
	)
}

export default AnimatedTabs
