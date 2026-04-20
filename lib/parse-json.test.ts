import { assertEquals } from '@std/assert'
import { parse_json } from './parse-json.ts'

Deno.test('parse_json', async (t) => {
	await t.step('parses object', () => {
		const r = parse_json('{"a":1}')
		assertEquals(r.ok, true)
		if (r.ok) assertEquals(r.value, { a: 1 })
	})

	await t.step('parses array', () => {
		const r = parse_json('[1,2]')
		assertEquals(r.ok, true)
		if (r.ok) assertEquals(r.value, [1, 2])
	})

	await t.step('invalid json', () => {
		const r = parse_json('{')
		assertEquals(r.ok, false)
		if (!r.ok) {
			assertEquals(r.error.key, 'invalid json')
		}
	})

	await t.step('primitive json', async (t2) => {
		await t2.step('null', () => {
			const r = parse_json('null')
			assertEquals(r.ok, false)
			if (!r.ok) {
				assertEquals(r.error.key, 'primitive json')
				assertEquals(r.error.error, null)
			}
		})

		await t2.step('string', () => {
			const r = parse_json('"hello"')
			assertEquals(r.ok, false)
			if (!r.ok) assertEquals(r.error.key, 'primitive json')
		})

		await t2.step('number', () => {
			const r = parse_json('42')
			assertEquals(r.ok, false)
			if (!r.ok) assertEquals(r.error.key, 'primitive json')
		})

		await t2.step('boolean', () => {
			const r = parse_json('true')
			assertEquals(r.ok, false)
			if (!r.ok) assertEquals(r.error.key, 'primitive json')
		})
	})
})
