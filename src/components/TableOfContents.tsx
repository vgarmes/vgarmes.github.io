import type { FunctionalComponent, JSX } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import type { TocItem } from '~/util/generateToc'
import cx from 'clsx'

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
			<li key={slug} className={cx('text-sm', { 'pl-3': depth > 2 })}>
				<a
					className={cx('leading-normal font-medium', {
						'text-indigo-600 dark:text-indigo-400':
							currentHeading.slug === slug,
						'opacity-70 hover:opacity-100': currentHeading.slug !== slug
					})}
					href={`#${slug}`}
					onClick={onLinkClick}
				>
					{text}
				</a>
				{children.length > 0 ? (
					<ul className="space-y-2 pt-3">
						{children.map(heading => (
							<TableOfContentsItem key={heading.slug} heading={heading} />
						))}
					</ul>
				) : null}
			</li>
		)
	}

	return (
		<aside className="sticky top-16 right-0 col-3 hidden max-h-[calc(100vh-4rem)] w-full flex-grow flex-col gap-3 pb-3 xl:flex">
			{toc.length > 0 && (
				<h2 className="w-full text-sm font-medium tracking-wide">
					Table of Contents
				</h2>
			)}
			<div
				className="h-full max-h-[calc(100vh-10rem)] overflow-y-auto"
				style={{ overscrollBehavior: 'contain' }}
				role="navigation"
			>
				<ul className="space-y-3 pb-3">
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
