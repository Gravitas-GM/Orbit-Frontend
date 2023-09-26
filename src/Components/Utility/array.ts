export function replace<T>(items: T[], old: T, replacement: T, inline: boolean = false) {
	if (!inline)
		items = [...items];

	const index = items.indexOf(old);

	if (index === -1)
		throw new Error('Value could not be found in array');

	items[index] = replacement;

	return items;
}

export function replaceByIndex<T>(items: T[], oldIndex: number, newValue: T, inline: boolean = false) {
	if (typeof items[oldIndex] === 'undefined')
		throw new Error('Old index could not be found in array');

	if (!inline)
		items = [...items];

	items[oldIndex] = newValue;

	return items;
}
