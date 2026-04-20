import { assertEquals } from '@std/assert'
import { dont_throw, dont_throw_async } from './dont-throw.ts'

Deno.test('dont_throw', async (t) => {
	await t.step('returns value on success', () => {
		const r = dont_throw(() => 42)
		assertEquals(r.ok, true)
		if (r.ok) assertEquals(r.value, 42)
	})

	await t.step('catches thrown error', () => {
		const err = new Error('boom')
		const r = dont_throw(() => {
			throw err
		})
		assertEquals(r.ok, false)
		if (!r.ok) assertEquals(r.error, err)
	})
})

Deno.test('dont_throw_async', async (t) => {
	await t.step('returns value on success', async () => {
		const r = await dont_throw_async(() => Promise.resolve('ok'))
		assertEquals(r.ok, true)
		if (r.ok) assertEquals(r.value, 'ok')
	})

	await t.step('catches rejection', async () => {
		const r = await dont_throw_async(() => {
			throw new Error('async boom')
		})
		assertEquals(r.ok, false)
		if (!r.ok) assertEquals((r.error as Error).message, 'async boom')
	})
})
