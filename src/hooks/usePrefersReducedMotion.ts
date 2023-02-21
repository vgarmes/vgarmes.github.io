import { useEffect, useState } from 'preact/hooks'

const QUERY = '(prefers-reduced-motion: no-preference)'

const isSSR = typeof window === 'undefined'

const getInitialState = () => {
	return isSSR || !window.matchMedia(QUERY)
}

export function usePrefersReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] =
		useState(getInitialState)

	useEffect(() => {
		const mediaQueryList = window.matchMedia(QUERY)

		const listener = (event: MediaQueryListEvent) => {
			setPrefersReducedMotion(!event.matches)
		}

		if (mediaQueryList.addEventListener) {
			mediaQueryList.addEventListener('change', listener)
		}

		return () => mediaQueryList.removeEventListener('change', listener)
	}, [])

	return prefersReducedMotion
}
