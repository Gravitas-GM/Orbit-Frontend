export function ucfirst(value: string) {
	if (!value.length)
		return value;

	return value.charAt(0).toUpperCase() + (value.length > 1 ? value.substr(1) : '');
}

export function ucwords(value: string, separator: string = ' ') {
	return value.split(separator).map(ucfirst).join(separator);
}

const numberFormatter = new Intl.NumberFormat();

export function formatNumber(number: number | null | undefined) {
	if (number === null || number === undefined)
		return null;

	return numberFormatter.format(number);
}

export function compareStrings(a: string, b: string) {
	return a.localeCompare(b, undefined, {sensitivity: 'base'});
}
