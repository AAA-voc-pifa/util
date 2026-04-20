import { assertEquals } from '@std/assert'
import { is_email, is_real_str } from './type-guard.ts'

Deno.test('is_real_str', async (t) => {
	await t.step('rejects non-strings', () => {
		assertEquals(is_real_str(undefined), false)
		assertEquals(is_real_str(null), false)
		assertEquals(is_real_str(0), false)
		assertEquals(is_real_str({}), false)
	})

	await t.step('rejects empty string', () => {
		assertEquals(is_real_str(''), false)
	})

	await t.step('accepts non-empty string', () => {
		assertEquals(is_real_str('a'), true)
		assertEquals(is_real_str(' '), true)
	})
})

Deno.test('is_email', async (t) => {
	await t.step('accepts common valid addresses', () => {
		assertEquals(is_email('a@b.co'), true)
		assertEquals(is_email('user.name+tag@example.com'), true)
		assertEquals(is_email("o'brien@example.org"), true)
	})

	await t.step('rejects invalid addresses', () => {
		assertEquals(is_email(''), false)
		assertEquals(is_email('plain'), false)
		assertEquals(is_email('@nodomain.com'), false)
		assertEquals(is_email('user@'), false)
		assertEquals(is_email('user..name@example.com'), false)
	})
})
