import type { I_result, I_async_result } from './result.ts'

export
function dont_throw<T>(job: () => T): I_result<T, unknown> {
	try {
		return { ok: true, value: job() }
	} catch (error) {
		return { ok: false, error }
	}
}

export
async function dont_throw_async<T>(job: () => Promise<T>): I_async_result<T, unknown> {
	try {
		return { ok: true, value: await job() }
	} catch (error) {
		return { ok: false, error }
	}
}
