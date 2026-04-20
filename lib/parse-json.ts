import type { I_result, I_result_error_with_key } from './result.ts'
import { dont_throw } from './dont-throw.ts'
import { error_result } from './result.ts'

type I_json_value =
	| string
	| number
	| boolean
	| null
	| I_json_obj
	| I_json_array
type I_json_obj = { [key: string]: I_json_value }
type I_json_array = I_json_value[]

export
type I_error_key__retrieve_json_body = 'invalid json' | 'primitive json'

export
function parse_json(json: string):
	I_result<I_json_obj | I_json_array, I_result_error_with_key<I_error_key__retrieve_json_body>>
{
	const parsed = dont_throw(() => JSON.parse(json))
	if (parsed.ok === false)
		return error_result('invalid json', parsed.error)
	const body = parsed.value
	if (body === null || typeof(body) !== 'object')
		return error_result('primitive json', null)
	return { ok: true, value: body }
}
