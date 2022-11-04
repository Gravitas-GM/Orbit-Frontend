export function parseApiTimestamp(input: any): Date {
	if (typeof input === 'string')
		return new Date(input);
	else if (input instanceof Date)
		return input;

	console.error('Cannot convert input to Date: ', input);

	throw new Error(`Cannot convert input to Date`);
}

export function formatDate(input: any) {
	if (typeof input === 'string')
		return new Intl.DateTimeFormat('default', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(parseApiTimestamp(input));
	else if (input instanceof Date)
		return new Intl.DateTimeFormat('default', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(input);

	console.error('Cannot format provided input: ', input);

	throw new Error(`Cannot format provided input`);
}