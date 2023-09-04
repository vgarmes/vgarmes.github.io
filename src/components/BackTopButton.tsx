const BackTopButton = () => (
	<button
		className="text-sm underline decoration-indigo-900 underline-offset-2 opacity-70 hover:opacity-100 dark:decoration-yellow-400"
		onClick={() => window.scrollTo({ top: 0 })}
	>
		Back to top
	</button>
)

export default BackTopButton
