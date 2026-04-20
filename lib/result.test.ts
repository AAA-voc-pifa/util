import { assertEquals } from '@std/assert'
import { error_result } from './result.ts'

Deno.test('error_result', async (t) => {
	await t.step('wraps key and error', () => {
		const r = error_result('not_found', 404)
		assertEquals(r.ok, false)
		if (!r.ok) {
			assertEquals(r.error.key, 'not_found')
			assertEquals(r.error.error, 404)
		}
	})

	await t.step('preserves error type', () => {
		const r = error_result('x', new Error('msg'))
		assertEquals(r.ok, false)
		if (!r.ok && r.error.error instanceof Error) {
			assertEquals(r.error.error.message, 'msg')
		}
	})
})
