// Based on https://vercel.com/design/loading-dots
export const LoadingDots = () => {
	return (
		<div className="space-x-1 text-sm font-bold">
			<span className="inline-flex animate-pulse rounded-full">&bull;</span>
			<span className="inline-flex animate-pulse rounded-full [animation-delay:0.4s]">
				&bull;
			</span>
			<span className="inline-flex animate-pulse rounded-full [animation-delay:0.6s]">
				&bull;
			</span>
		</div>
	)
}
