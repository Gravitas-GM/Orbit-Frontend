export function debug<T>(value: T, message?: string): T {
	const args: any[] = [value];

	if (message)
		args.unshift(`[${message}]`);

	console.debug(...args);
	return value;
}
