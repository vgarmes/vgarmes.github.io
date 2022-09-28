import { useEffect, useState } from 'preact/hooks'

const ThemeToggle = () => {
	const [theme, setTheme] = useState(() => {
		if (import.meta.env.SSR) {
			return undefined
		}
		return document.documentElement.classList.contains('dark')
			? 'dark'
			: 'light'
	})

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'light') {
			root.classList.remove('dark')
		} else {
			root.classList.add('dark')
		}
	}, [theme])

	const toggleTheme = () => {
		console.log(theme)
		const newTheme = theme === 'light' ? 'dark' : 'light'
		localStorage.setItem('theme', newTheme)
		setTheme(newTheme)
	}

	return (
		<button onClick={toggleTheme} aria-label="Toggle theme">
			<span>{theme === 'light' ? 'suun' : 'moon'}</span>
		</button>
	)
}

export default ThemeToggle
