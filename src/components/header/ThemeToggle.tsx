import type { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import Toggle from './Toggle'

type Theme = 'dark' | 'light'

const ThemeToggle: FunctionalComponent = () => {
	const [theme, setTheme] = useState<Theme | null>(() => {
		if (typeof window === 'undefined') {
			return null
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
		const newTheme = theme === 'light' ? 'dark' : 'light'
		localStorage.setItem('theme', newTheme)
		setTheme(newTheme)
	}

	return <Toggle onClick={toggleTheme} theme={theme || 'dark'} />
}

export default ThemeToggle
