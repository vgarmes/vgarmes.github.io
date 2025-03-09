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
	// Calculate the absolute difference between the current time and the provided timestamp
	let timeDifference = Math.abs(new Date().getTime() - date.getTime())

	// Initialize an empty array to store the time units
	const timeParts = []

	// Iterate over a predefined array of time units and their corresponding milliseconds
	for (const { unit: unitName, ms: unitMilliseconds } of timeUnits) {
		// Calculate how many of the current unit fit into the remaining time difference
		const unitCount = Math.floor(timeDifference / unitMilliseconds)

		// If the unit count is greater than 0 or if we already have some parts in the array
		if (unitCount > 0 || timeParts.length > 0) {
			// Add the unit count and unit name to the array, pluralizing if necessary
			timeParts.push(`${unitCount} ${unitName}${unitCount !== 1 ? 's' : ''}`)

			// Update the remaining time difference by taking the remainder after division
			timeDifference %= unitMilliseconds
		}

		// If we have collected 3 time parts, stop the loop
		if (timeParts.length === 3) {
			break
		}
	}

	// Join the time parts with commas and return the result
	return timeParts.join(', ')
}

const useTimeDistance = (date: Date) => {
	// State to hold the formatted time distance
	const [timeDistance, setTimeDistance] = useState('')

	// Effect to update the time distance
	useEffect(() => {
		// Function to calculate and update the time distance
		const updateTimeDistance = () => {
			// Format the time difference into a human-readable string
			const formattedTime = formatDistanceToNow(date)

			// Update the state with the formatted time distance
			setTimeDistance(formattedTime ? `${formattedTime} ago` : 'Just now')
		}

		// Initial call to set the time distance
		updateTimeDistance()

		// Set up an interval to update the time distance every second
		const intervalId = setInterval(updateTimeDistance, 1000)

		// Cleanup function to clear the interval when the component unmounts or `e` changes
		return () => clearInterval(intervalId)
	}, [date]) // Re-run the effect when `e` changes

	// Return the formatted time distance
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
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-1.5">
				<div class="bg-muted flex h-4 items-center justify-center rounded-xs px-1.5">
					<span class="text-muted-foreground font-mono text-xs">
						{formattedTz}
					</span>
				</div>
				<span class="text-sm">
					{date.toLocaleString('en-US', {
						timeZone: zone,
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</span>
			</div>
			<span class="text-muted-foreground font-mono text-xs tabular-nums">
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
			<div class="flex flex-col gap-3">
				<div class="flex flex-col gap-3">
					<span class="text-muted-foreground text-xs tabular-nums">
						{timeDistance}
					</span>
				</div>
				<div class="flex flex-col gap-2">
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
