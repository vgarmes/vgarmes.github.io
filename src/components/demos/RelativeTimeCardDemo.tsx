import RelativeTimeCard from './RelativeTimeCard'

const RelativeTimeCardDemo = () => {
	const date = new Date()
	return (
		<div className="flex justify-center">
			<RelativeTimeCard date={date} />
		</div>
	)
}
export default RelativeTimeCardDemo
