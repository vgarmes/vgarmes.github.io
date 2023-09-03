import type { HonoRequest } from 'hono'

export async function hashIpAddress(ipAddress: string, salt: string) {
	const encoder = new TextEncoder()
	const data = encoder.encode(ipAddress + salt) // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest('SHA-256', data) // hash the ip address
	const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
	return hashHex.slice(0, 16) // truncate the length to reduce the size of the db column
}

export function getIpAddressFromHeader(
	header: HonoRequest['header'],
	fallback = '0.0.0.0'
) {
	return header('x-forwarded-for') || fallback
}
