import type { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

type Theme = 'dark' | 'light' | 'system'

interface Props {
	id?: string
}
const ThemeSwitcher: FunctionalComponent<Props> = ({ id = 'desktop' }) => {
	const [theme, setTheme] = useState<Theme | null>(null)

	useEffect(() => {
		setTheme('theme' in localStorage ? (localStorage.theme as Theme) : 'system')
	}, [])

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme)

		if (newTheme === 'system') {
			localStorage.removeItem('theme')
		} else {
			localStorage.setItem('theme', newTheme)
		}

		const prefersDark =
			newTheme === 'dark' ||
			(newTheme === 'system' &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)

		document.documentElement.classList.toggle('dark', prefersDark)
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', prefersDark ? '#111110' : '#eeeeec')
	}

	return (
		<fieldset class="flex h-8 w-fit items-center rounded-full shadow-(--ds-shadow-border)">
			<legend class="sr-only">Select a display theme</legend>
			<span class="h-full">
				<label
					for={`theme-switcher-system-${id}`}
					class="text-muted-foreground has-checked:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full has-checked:shadow-[0_0_0_1px_var(--gray-400),0_1px_2px_0_var(--gray-alpha-100)] [&>svg]:size-4"
				>
					<input
						id={`theme-switcher-system-${id}`}
						type="radio"
						aria-label="system"
						value="system"
						class="sr-only"
						checked={theme === 'system'}
						onChange={() => {
							handleThemeChange('system')
						}}
					/>
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
					>
						<path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" />
						<path d="M20.054 15.987H3.946" />
					</svg>
				</label>
			</span>
			<span class="h-full">
				<label
					for={`theme-switcher-light-${id}`}
					class="text-muted-foreground has-checked:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full has-checked:shadow-[0_0_0_1px_var(--gray-400),0_1px_2px_0_var(--gray-alpha-100)] [&>svg]:size-4"
				>
					<input
						id={`theme-switcher-light-${id}`}
						type="radio"
						aria-label="light"
						class="sr-only"
						value="light"
						checked={theme === 'light'}
						onChange={() => {
							handleThemeChange('light')
						}}
					/>
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
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</svg>
				</label>
			</span>
			<span class="h-full">
				<label
					for={`theme-switcher-dark-${id}`}
					class="text-muted-foreground has-checked:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full has-checked:shadow-[0_0_0_1px_var(--gray-400),0_1px_2px_0_var(--gray-alpha-100)] [&>svg]:size-4"
				>
					<input
						id={`theme-switcher-dark-${id}`}
						type="radio"
						aria-label="dark"
						class="sr-only"
						value="dark"
						checked={theme === 'dark'}
						onChange={() => {
							handleThemeChange('dark')
						}}
					/>
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
					>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				</label>
			</span>
		</fieldset>
	)
}

export default ThemeSwitcher
