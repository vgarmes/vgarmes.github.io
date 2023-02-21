import type { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { animated } from '@react-spring/web'
import { useBoop } from '~/hooks/useBoop'
// This component is intended to be used with client directive 'client:load' so it skips SSR (theme will be undefined in server)

const icons = {
	sun: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-sun"
		>
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		</svg>
	),
	moon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-moon"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	)
}
const ThemeToggle: FunctionalComponent = () => {
	const [theme, setTheme] = useState(
		document.documentElement.classList.contains('dark') ? 'dark' : 'light'
	)
	const { style, trigger } = useBoop({ rotation: 20, timing: 200 })

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'light') {
			root.classList.remove('dark')
		} else {
			root.classList.add('dark')
		}
	}, [theme])

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		localStorage.setItem('theme', newTheme)
		setTheme(newTheme)
	}

	return (
		<animated.span onClick={trigger} style={style}>
			<button
				className="animate-fadein"
				onClick={toggleTheme}
				aria-label="Toggle theme"
			>
				{theme === 'light' ? icons.moon : icons.sun}
			</button>
		</animated.span>
	)
}

export default ThemeToggle
