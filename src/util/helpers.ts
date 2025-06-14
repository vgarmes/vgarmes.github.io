const CHARS_PER_MINUTE = 500
export function lengthToReadingTime(length: number) {
	const minutes = Math.round(length / CHARS_PER_MINUTE) || 1
	const cups = Math.min(Math.round(minutes / 5), 5)

	return `${new Array(cups || 1).fill('☕️').join('')} ${minutes} min read`
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

export function formatDate(date: string | number | Date) {
	return dateFormatter.format(new Date(date))
}
