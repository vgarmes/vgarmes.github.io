const CHARS_PER_MINUTE = 1500
export function lengthToReadingTime(length: number) {
	const minutes = Math.round(length / CHARS_PER_MINUTE) || 1
	const cups = Math.min(Math.round(minutes / 5), 5)

	return `${new Array(cups || 1).fill('☕️').join('')} ${minutes} min read`
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	dateStyle: 'full'
})
export function formatDate(date: string) {
	return dateFormatter.format(new Date(date))
}
