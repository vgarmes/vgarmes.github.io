import type { FunctionalComponent, JSX } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import type { TocItem } from '~/util/generateToc'

interface Props {
	toc: TocItem[]
}

const TableOfContents: FunctionalComponent<Props> = ({ toc }) => {
	const [currentHeading, setCurrentHeading] = useState({
		slug: toc[0]?.slug,
		text: toc[0]?.text
	})

	useEffect(() => {
		const setCurrent: IntersectionObserverCallback = entries => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					setCurrentHeading({
						slug: entry.target.id,
						text: entry.target.textContent || ''
					})
					break
				}
			}
		}

		const observerOptions: IntersectionObserverInit = {
			rootMargin: '-60px 0% -66%',
			threshold: 1
		}

		const headingsObserver = new IntersectionObserver(
			setCurrent,
			observerOptions
		)

		document
			.querySelectorAll('#article-content :is(h1,h2,h3)')
			.forEach(h => headingsObserver.observe(h))

		return () => headingsObserver.disconnect()
	}, [])

	const onLinkClick = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) =>
		setCurrentHeading({
			slug: e.currentTarget.getAttribute('href')!.replace('#', ''),
			text: e.currentTarget.textContent || ''
		})

	return (
		<aside
			role="navigation"
			className={`sticky top-0 right-0 hidden flex-1 pt-16 lg:block`}
		>
			{toc.length > 0 && (
				<h2 className="mb-3 w-full px-4 pl-8 text-sm font-bold uppercase tracking-wide lg:mb-3">
					Table of contents
				</h2>
			)}
			<div
				className="h-full max-h-[calc(100vh-7.5rem)] overflow-y-auto pl-8"
				style={{ overscrollBehavior: 'contain' }}
			>
				<ul className="space-y-2 pb-16">
					{toc.length > 0 &&
						toc.map(tocItem => (
							<li key={tocItem.slug} className="text-sm">
								<a
									className={`'block py-2 leading-normal ${
										currentHeading.slug === tocItem.slug
											? 'font-bold text-pink-600 dark:text-pink-500'
											: 'font-semibold opacity-70 hover:opacity-100'
									}`}
									href={`#${tocItem.slug}`}
									onClick={onLinkClick}
								>
									{tocItem.text}
								</a>
							</li>
						))}
				</ul>
			</div>
		</aside>
	)
}

export default TableOfContents
