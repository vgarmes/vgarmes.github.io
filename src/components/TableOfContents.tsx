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
			rootMargin: '15% 0% -35% 0%',
			threshold: 0
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
			<li key={slug} className={cx({ 'pl-3': depth > 2 })}>
				<a
					className={cx(
						'block text-[0.8125rem] leading-tight transition-colors',
						{
							'text-foreground': currentHeading.slug === slug,
							'hover:text-foreground text-(--gray-alpha-900)':
								currentHeading.slug !== slug
						}
					)}
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
		<nav
			className="scrollbar-none max-h-[calc(100vh-10rem)] max-w-40 overflow-y-auto pt-8"
			style={{ overscrollBehavior: 'contain' }}
			role="navigation"
		>
			<ul className="flex flex-col gap-2 pb-3">
				{toc.length > 1 &&
					toc.map(tocItem => (
						<TableOfContentsItem key={tocItem.slug} heading={tocItem} />
					))}
			</ul>
		</nav>
	)
}

export default TableOfContents
