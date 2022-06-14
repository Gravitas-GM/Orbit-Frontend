import {history} from '../../history';

function hasFromState(value: any): value is { from: { pathname: string } | string } {
	return typeof value === 'object' && 'from' in value;
}

export function getPreviousPathFromState(def: string = '/') {
	const state = history.location.state;

	if (!hasFromState(state))
		return def;

	const pathname = typeof state.from === 'object' ? state.from.pathname : state.from;

	return pathname === '/login' ? def : pathname;
}
