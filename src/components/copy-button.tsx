import type { ComponentProps } from 'preact'
import { useState } from 'preact/hooks'
import { cn } from '~/util/cn'

function useCopyToClipboard({
	timeout = 2000,
	onCopy
}: {
	timeout?: number
	onCopy?: () => void
} = {}) {
	const [isCopied, setIsCopied] = useState(false)

	const copyToClipboard = (value: string) => {
		if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
			return
		}

		if (!value) return

		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true)

			if (onCopy) {
				onCopy()
			}

			if (timeout !== 0) {
				setTimeout(() => {
					setIsCopied(false)
				}, timeout)
			}
		}, console.error)
	}

	return { isCopied, copyToClipboard }
}

function CopyIcon(props: ComponentProps<'svg'>) {
	return (
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
			{...props}
		>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
		</svg>
	)
}

function CheckIcon(props: ComponentProps<'svg'>) {
	return (
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
			{...props}
		>
			<path d="M20 6 9 17l-5-5"></path>
		</svg>
	)
}

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
	const { isCopied, copyToClipboard } = useCopyToClipboard()
	return (
		<button
			className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md [&>svg]:size-4"
			onClick={() => copyToClipboard(textToCopy)}
			title="Copy to clipboard"
		>
			<CheckIcon
				className={cn(
					'absolute scale-50 opacity-0 transition-all duration-200 ease-in-out',
					{ 'scale-100 opacity-100': isCopied }
				)}
			/>
			<CopyIcon
				className={cn(
					'absolute scale-50 opacity-0 transition-all duration-200 ease-in-out',
					{ 'scale-100 opacity-100': !isCopied }
				)}
			/>
		</button>
	)
}
