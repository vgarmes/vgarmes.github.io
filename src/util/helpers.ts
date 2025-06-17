const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

export function formatDate(date: string | number | Date) {
	return dateFormatter.format(new Date(date))
}
