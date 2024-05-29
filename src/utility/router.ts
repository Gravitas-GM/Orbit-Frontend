import {Location} from 'history';

function hasFromState(value: any): value is { from: { pathname: string } | string } {
	return typeof value === 'object' && 'from' in value;
}

export function getPreviousPathFromState(location: Location, def: string = '/') {
	const {state} = location;

	if (!hasFromState(state))
		return def;

	const pathname = typeof state.from === 'object' ? state.from.pathname : state.from;

	// Prevents potential redirect loops.
	if (pathname === location.pathname)
		return def;

	return pathname;
}
