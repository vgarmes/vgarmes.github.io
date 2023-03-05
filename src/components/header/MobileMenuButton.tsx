import { useEffect, useState } from 'preact/hooks'
import './MobileMenuButton.css'

const SidebarToggle = () => {
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		if (isOpen) {
			body?.classList.add('mobile-toggle-on')
		} else {
			body?.classList.remove('mobile-toggle-on')
		}
	}, [isOpen])

	return (
		<button
			id="sidebar-toggle"
			class="z-20 inline-flex justify-center rounded-md border border-zinc-400 p-2 text-sm font-medium shadow-sm transition-all hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
			aria-label={isOpen ? 'Close menu' : 'Open menu'}
			type="button"
			aria-haspopup="menu"
			aria-expanded={isOpen}
			onClick={() => setIsOpen(!isOpen)}
		>
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 100 100"
				class="h-5 w-5"
				height="1em"
				width="1em"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect
					class="line line_top"
					width="80"
					height="10"
					x="10"
					y="25"
					rx="5"
				></rect>
				<rect
					class="line line_middle"
					width="80"
					height="10"
					x="10"
					y="45"
					rx="5"
				></rect>
				<rect
					class={'line line_bottom'}
					width="80"
					height="10"
					x="10"
					y="65"
					rx="5"
				></rect>
			</svg>
		</button>
	)
}

export default SidebarToggle
