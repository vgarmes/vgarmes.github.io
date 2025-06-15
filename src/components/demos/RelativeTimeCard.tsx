import type { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface Props {
	date: Date
}

const timeUnits = [
	{
		unit: 'year',
		ms: 31536e6
	},
	{
		unit: 'month',
		ms: 2628e6
	},
	{
		unit: 'day',
		ms: 864e5
	},
	{
		unit: 'hour',
		ms: 36e5
	},
	{
		unit: 'minute',
		ms: 6e4
	},
	{
		unit: 'second',
		ms: 1e3
	}
]

function formatDistanceToNow(date: Date): string {
	let timeDifference = Math.abs(new Date().getTime() - date.getTime())

	const timeParts = []

	for (const { unit: unitName, ms: unitMilliseconds } of timeUnits) {
		const unitCount = Math.floor(timeDifference / unitMilliseconds)

		if (unitCount > 0 || timeParts.length > 0) {
			timeParts.push(`${unitCount} ${unitName}${unitCount !== 1 ? 's' : ''}`)
			timeDifference %= unitMilliseconds
		}

		if (timeParts.length === 3) {
			break
		}
	}

	return timeParts.length === 0 ? 'Just now' : `${timeParts.join(', ')} ago`
}

const useTimeDistance = (date: Date) => {
	const [timeDistance, setTimeDistance] = useState(formatDistanceToNow(date))

	useEffect(() => {
		const updateTimeDistance = () => {
			const formattedTime = formatDistanceToNow(date)

			setTimeDistance(formattedTime)
		}

		const intervalId = setInterval(updateTimeDistance, 1000)

		return () => clearInterval(intervalId)
	}, [date])

	return timeDistance
}

const DateTimeZone: FunctionalComponent<{ date: Date; zone: string }> = ({
	date,
	zone
}) => {
	const formattedTz = new Intl.DateTimeFormat('en-US', {
		timeZone: zone,
		timeZoneName: 'short'
	})
		.formatToParts(date)
		.find(part => part.type === 'timeZoneName')?.value
	return (
		<div className="flex items-center justify-between gap-3">
			<div className="flex items-center gap-1.5">
				<div className="bg-muted flex h-4 items-center justify-center rounded-xs px-1.5">
					<span className="text-muted-foreground font-mono text-xs">
						{formattedTz}
					</span>
				</div>
				<span className="text-sm">
					{date.toLocaleString('en-US', {
						timeZone: zone,
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</span>
			</div>
			<span className="text-muted-foreground font-mono text-xs tabular-nums">
				{date.toLocaleTimeString('en-US', {
					timeZone: zone,
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				})}
			</span>
		</div>
	)
}

const RelativeTimeCard: FunctionalComponent<Props> = ({ date }) => {
	const timeDistance = useTimeDistance(date)
	return (
		<div className="bg-background border-border w-[325px] rounded-md border p-3 shadow-md">
			<div className="flex flex-col gap-3">
				<span className="text-muted-foreground text-xs tabular-nums">
					{timeDistance}
				</span>
				<div className="flex flex-col gap-2">
					<DateTimeZone date={date} zone="utc" />
					<DateTimeZone
						date={date}
						zone={Intl.DateTimeFormat().resolvedOptions().timeZone}
					/>
				</div>
			</div>
		</div>
	)
}

export default RelativeTimeCard
