import type { I_async_result } from './result.ts'
import type {
	I_json_obj,
	I_json_array,
	I_error_key__retrieve_json_body,
} from './parse-json.ts'
import { parse_json } from './parse-json.ts'
import type { I_result_error_with_key } from './result.ts'
import { error_result } from './result.ts'

async function read_body_text_with_byte_limit(
	request: Request,
	max_bytes: number,
): I_async_result<string | null, null> {
	const content_length = request.headers.get('Content-Length')
	if (content_length !== null) {
		const n = Number(content_length)
		if (Number.isFinite(n) && n > max_bytes)
			return { ok: false, error: null }
	}

	const stream = request.body
	if (stream === null)
		return { ok: true, value: null }

	const reader = stream.getReader()
	const chunks: Uint8Array[] = []
	let total = 0

	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done)
				break
			if (value === undefined)
				continue
			total += value.byteLength
			if (total > max_bytes) {
				// await reader.cancel()
				reader.cancel()
				return { ok: false, error: null }
			}
			chunks.push(value)
		}
	} finally {
		reader.releaseLock()
	}

	if (total === 0)
		return { ok: true, value: '' }

	const merged = new Uint8Array(total)
	let offset = 0
	for (const chunk of chunks) {
		merged.set(chunk, offset)
		offset += chunk.byteLength
	}

	return { ok: true, value: new TextDecoder().decode(merged) }
}

export
async function receive_json(
	request: Request,
	max_bytes: number = 1024 * 1024,
): I_async_result<
	I_json_obj | I_json_array,
	I_result_error_with_key<
		| I_error_key__retrieve_json_body
		| 'body too large'
		| 'empty body'
	>
> {
	const read = await read_body_text_with_byte_limit(request, max_bytes)
	if (read.ok === false)
		return error_result('body too large', null)
	else if (read.value === null)
		return error_result('empty body', null)
	else
		return parse_json(read.value)
}
