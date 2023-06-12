export function replace<T>(items: T[], old: T, replacement: T, inline: boolean = false) {
	if (!inline)
		items = [...items];

	const index = items.indexOf(old);

	if (index === -1)
		throw new Error('Value could not be found in array');

	items[index] = replacement;

	return items;
}
