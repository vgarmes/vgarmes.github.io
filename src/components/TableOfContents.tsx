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
			.querySelectorAll('article :is(h1,h2,h3)')
			.forEach(h => headingsObserver.observe(h))

		return () => headingsObserver.disconnect()
	}, [])

	const onLinkClick = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) =>
		setCurrentHeading({
			slug: e.currentTarget.getAttribute('href')!.replace('#', ''),
			text: e.currentTarget.textContent || ''
		})

	const TableOfContentsItem = ({ heading }: { heading: TocItem }) => {
		const { text, slug, children, depth } = heading
		return (
			<li key={slug} className="text-sm">
				<a
					className={`block py-1 leading-normal ${
						currentHeading.slug === slug
							? 'font-bold text-indigo-600 dark:text-indigo-400'
							: 'font-semibold opacity-70 hover:opacity-100'
					} ${depth > 2 ? 'pl-3' : ''}`}
					href={`#${slug}`}
					onClick={onLinkClick}
				>
					{text}
				</a>
				{children.length > 0 ? (
					<ul>
						{children.map(heading => (
							<TableOfContentsItem key={heading.slug} heading={heading} />
						))}
					</ul>
				) : null}
			</li>
		)
	}

	return (
		<aside
			role="navigation"
			className={`sticky top-0 right-0 hidden flex-1 pt-16 pl-12 lg:block`}
		>
			{toc.length > 0 && (
				<h2 className="mb-3 w-full text-sm font-bold uppercase tracking-wide lg:mb-3">
					Table of contents
				</h2>
			)}
			<div
				className="h-full max-h-[calc(100vh-7.5rem)] overflow-y-auto"
				style={{ overscrollBehavior: 'contain' }}
			>
				<ul className="space-y-2">
					{toc.length > 0 &&
						toc.map(tocItem => (
							<TableOfContentsItem key={tocItem.slug} heading={tocItem} />
						))}
				</ul>
			</div>
		</aside>
	)
}

export default TableOfContents
