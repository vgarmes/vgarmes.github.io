const BackTopButton = () => (
	<button
		className="text-sm opacity-70 hover:opacity-100"
		onClick={() => window.scrollTo({ top: 0 })}
	>
		Back to top
	</button>
)

export default BackTopButton
