import type { FunctionalComponent, JSX } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import type { TocItem } from '~/util/generateToc'
import BackTopButton from './BackTopButton'
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
			<li key={slug} className="text-sm">
				<a
					className={cx('flex items-start py-1 leading-normal', {
						'font-bold text-indigo-600 dark:text-indigo-400':
							currentHeading.slug === slug,
						'font-semibold opacity-70 hover:opacity-100':
							currentHeading.slug !== slug,
						'pl-2': depth > 2
					})}
					href={`#${slug}`}
					onClick={onLinkClick}
				>
					{depth > 2 && (
						<span className="mr-1 pt-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="h-3 w-3"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.25 4.5l7.5 7.5-7.5 7.5"
									stroke-width={3}
								/>
							</svg>
						</span>
					)}
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
		<aside className="sticky top-16 right-0 ml-20 hidden max-h-[calc(100vh-4rem)] flex-grow flex-col gap-3 pb-3 lg:flex">
			{toc.length > 0 && (
				<h2 className="w-full text-sm font-bold uppercase tracking-wide">
					Table of contents
				</h2>
			)}
			<div
				className="h-full max-h-[calc(100vh-10rem)] overflow-y-auto"
				style={{ overscrollBehavior: 'contain' }}
				role="navigation"
			>
				<ul className="space-y-2">
					{toc.length > 0 &&
						toc.map(tocItem => (
							<TableOfContentsItem key={tocItem.slug} heading={tocItem} />
						))}
				</ul>
			</div>
			<div className="flex min-w-[180px] items-center justify-end border-t border-zinc-200 pt-3 dark:border-zinc-700">
				<BackTopButton />
			</div>
		</aside>
	)
}

export default TableOfContents
