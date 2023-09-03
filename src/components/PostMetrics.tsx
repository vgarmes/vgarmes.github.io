import type { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface Props {
	slug: string
}

const apiHost = import.meta.env.PUBLIC_API_HOST

const Metric: FunctionComponent<{
	value?: number
	units: string
	isLoading: boolean
}> = ({ value, units, isLoading }) => {
	if (isLoading) {
		return <div className="h-5 w-12 animate-pulse rounded bg-zinc-800"></div>
	}

	return (
		<div className="text-sm text-zinc-700 dark:text-zinc-300">{`${value} ${units}`}</div>
	)
}

const PostMetrics: FunctionComponent<Props> = ({ slug }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState<{ totalViews: number } | null>(null)

	useEffect(() => {
		const fetchStats = async () => {
			const response = await fetch(`${apiHost}/api/posts/${slug}/user-stats`)
			const data = await response.json()
			setData(data as { totalViews: number })
			setIsLoading(false)
		}

		fetchStats()
	}, [])

	if (isLoading) {
		return <div className="h-5 w-full animate-pulse rounded bg-zinc-800"></div>
	}
	return (
		<div className="grid grid-cols-2 gap-3">
			<Metric value={data?.totalViews} units="views" isLoading={false} />
			<Metric value={123} units="likes" isLoading={false} />
		</div>
	)
}

export default PostMetrics
