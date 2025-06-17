import type { FunctionalComponent } from 'preact'
import { useRef, useState } from 'preact/hooks'

const FILTERS = ['playlists', 'podcasts', 'artists'] as const
type FilterType = (typeof FILTERS)[number]

const SpotifyFilters: FunctionalComponent = () => {
	const [activeFilter, setActiveFilter] = useState<null | FilterType>(null)
	const [activeCategory, setActiveCategory] = useState<null | string>(null)

	const handleFilterChange = (filter: FilterType) => {
		const index = FILTERS.indexOf(filter)
		if (filterRefs.current[index] === null || containerRef.current === null)
			return

		if (activeFilter === filter) {
			setActiveFilter(null)
			filterRefs.current[index].style.transform = 'translateX(-2.5rem)'
		} else {
			setActiveFilter(filter)

			const distance =
				filterRefs.current[index].offsetLeft - containerRef.current.offsetLeft
			console.log(distance)

			filterRefs.current[index].style.transform =
				`translateX(calc(2.5rem - ${distance}px)`
		}
	}

	const handleCategoryChange = (category: string) => {
		if (activeCategory === category) {
			setActiveCategory(null)
		} else {
			setActiveCategory(category)
		}
	}

	const clearFilters = () => {
		setActiveFilter(null)
		filterRefs.current.forEach(ref => {
			if (ref) {
				ref.style.transform = 'translateX(-2.5rem)'
			}
		})
	}

	const containerRef = useRef<HTMLDivElement>(null)
	const filterRefs = useRef<(HTMLButtonElement | null)[]>([])

	return (
		<div ref={containerRef} className="flex items-center gap-2">
			<button
				disabled={activeFilter === null}
				className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-neutral-200 text-black transition-[opacity_0.2s,_transform_0.1s] delay-[0.2s,_0s] hover:scale-105 disabled:opacity-0 disabled:delay-[0s]"
				onClick={clearFilters}
			>
				<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
					<g
						fill="none"
						fill-rule="evenodd"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m7.5 7.5 6 6" />
						<path d="m13.5 7.5-6 6" />
					</g>
				</svg>
			</button>

			{FILTERS.map((filter, index) => (
				<button
					key={filter}
					role="radio"
					disabled={activeFilter !== null && activeFilter !== filter}
					aria-checked={activeFilter === filter}
					aria-hidden={activeFilter !== null && activeFilter !== filter}
					className="flex h-8 cursor-pointer items-center justify-center rounded-2xl bg-neutral-800 px-4 text-sm text-white opacity-100 transition-colors duration-300 ease-in-out not-aria-checked:hover:brightness-125 disabled:pointer-events-none disabled:opacity-0 aria-checked:bg-green-600 aria-checked:text-black"
					style={{
						transition: `transform 0.5s, background-color 0.1s, color 0.1s${activeFilter !== null && activeFilter !== filter ? '' : ', opacity 0.1s 0.2s'}`,
						transform: 'translateX(-2.5rem)'
					}}
					onClick={() => {
						handleFilterChange(filter)
					}}
					ref={el => (filterRefs.current[index] = el)}
				>
					{filter.charAt(0).toUpperCase() + filter.slice(1)}
				</button>
			))}

			{activeFilter === 'playlists' &&
				['By You', 'By Spotify', 'Downloaded'].map((playlist, index) => (
					<button
						key={playlist}
						role="radio"
						disabled={activeCategory !== null && activeCategory !== playlist}
						aria-checked={activeCategory === playlist}
						aria-hidden={activeCategory !== null && activeCategory !== playlist}
						className="flex h-8 cursor-pointer items-center justify-center rounded-2xl bg-neutral-800 px-4 text-sm text-white opacity-100 transition-colors duration-300 ease-in-out not-aria-checked:hover:brightness-125 disabled:pointer-events-none disabled:opacity-0 aria-checked:bg-green-600 aria-checked:text-black"
						style={{
							transition: `transform 0.5s, background-color 0.1s, color 0.1s${activeCategory !== null && activeCategory !== playlist ? '' : ', opacity 0.1s 0.2s'}`,
							transform: 'translateX(-2.5rem)'
						}}
						onClick={() => {
							handleCategoryChange(playlist)
						}}
						ref={el => (filterRefs.current[index] = el)}
					>
						{playlist.charAt(0).toUpperCase() + playlist.slice(1)}
					</button>
				))}
		</div>
	)
}

export default SpotifyFilters
