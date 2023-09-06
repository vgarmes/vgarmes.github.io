const BackTopButton = () => (
	<button
		className="text-sm font-bold underline-offset-2 opacity-70 hover:underline hover:decoration-pink-600 hover:opacity-100 hover:dark:decoration-yellow-400"
		onClick={() => window.scrollTo({ top: 0 })}
	>
		Back to top
	</button>
)

export default BackTopButton
