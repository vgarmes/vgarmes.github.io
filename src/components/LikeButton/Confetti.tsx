import type { FunctionComponent } from 'preact'

interface Props {
	active: boolean
}
const Confetti: FunctionComponent<Props> = ({ active }) => (
	<svg
		id="confetti"
		viewBox="467 392 58 57"
		xmlns="http://www.w3.org/2000/svg"
		className="pointer-events-none absolute top-1/2 left-1/2 w-[58px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
	>
		<g
			id="confetti-group"
			fill="none"
			fill-rule="evenodd"
			transform="translate(467 392)"
		>
			<g
				id="grp7"
				transform="translate(7 6)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#9CD8C3"
					cx="2"
					cy="6"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(-30px, -15px)' : 'none'
					}}
				/>
				<circle
					fill="#8CE8C3"
					cx="5"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(-55px, -30px)' : 'none'
					}}
				/>
			</g>

			<g
				id="grp6"
				transform="translate(0 28)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#CC8EF5"
					cx="2"
					cy="7"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(-30px, 0px)' : 'none'
					}}
				/>
				<circle
					fill="#91D2FA"
					cx="3"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(-60px, -5px)' : 'none'
					}}
				/>
			</g>

			<g
				id="grp3"
				transform="translate(52 28)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#8CE8C3"
					cx="4"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(30px, 0px)' : 'none'
					}}
				/>
				<circle
					fill="#9CD8C3"
					cx="2"
					cy="7"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(60px, 10px)' : 'none'
					}}
				/>
			</g>

			<g
				id="grp2"
				transform="translate(44 6)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#CC8EF5"
					cx="2"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(30px, -15px)' : 'none'
					}}
				/>
				<circle
					fill="#CC8EF5"
					cx="5"
					cy="6"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(60px, -15px)' : 'none'
					}}
				/>
			</g>

			<g
				id="grp5"
				transform="translate(14 50)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#91D2FA"
					cx="6"
					cy="5"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(-10px, 20px)' : 'none'
					}}
				/>
				<circle
					fill="#91D2FA"
					cx="2"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(-60px, 30px)' : 'none'
					}}
				/>
			</g>

			<g
				id="grp4"
				transform="translate(35 50)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#F48EA7"
					cx="6"
					cy="5"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(30px, 15px)' : 'none'
					}}
				/>
				<circle
					fill="#F48EA7"
					cx="2"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(40px, 50px)' : 'none'
					}}
				/>
			</g>
			<g
				id="grp1"
				transform="translate(24)"
				style={{ opacity: active ? 1 : 0 }}
			>
				<circle
					fill="#9FC7FA"
					cx="2.5"
					cy="3"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(0px, -30px)' : 'none'
					}}
				/>
				<circle
					fill="#9FC7FA"
					cx="7.5"
					cy="2"
					r="2"
					style={{
						transform: active ? 'scale(0) translate(10px, -50px)' : 'none'
					}}
				/>
			</g>
		</g>
	</svg>
)

export default Confetti
