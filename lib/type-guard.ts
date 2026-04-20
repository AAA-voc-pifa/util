export
function is_real_str(s: unknown): s is string {
	return typeof(s) === 'string' && s.length > 0
}

export
function is_email(email: string): boolean {
	const re = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
	return re.test(email)
}
