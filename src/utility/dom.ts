export function classNames(...classNames: any[]) {
	return classNames.filter(item => typeof item === 'string' && item.length > 0).join(' ');
}
