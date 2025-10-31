import RelativeTimeCard from './RelativeTimeCard'

const RelativeTimeCardDemo = () => {
	const date = new Date()
	return (
		<div className="my-6 flex justify-center">
			<RelativeTimeCard date={date} />
		</div>
	)
}
export default RelativeTimeCardDemo
