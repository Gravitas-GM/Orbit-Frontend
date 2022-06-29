export function parseApiTimestamp(input: any): Date {
	if (typeof input === 'string')
		return new Date(input);
	else if (input instanceof Date)
		return input;

	console.error('Cannot convert input to Date: ', input);

	throw new Error(`Cannot convert input to Date`);
}
