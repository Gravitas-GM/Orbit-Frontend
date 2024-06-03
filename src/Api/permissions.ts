export enum Permission {
	Admin = 'admin',
	DebugNeverGranted = '__never_granted',
}

export interface PermissionMatch {
	items: Permission[];
	type?: 'any' | 'all';
}

export type MatchQuery = PermissionMatch | Permission | Permission[];

export function isPermissionGranted(permissions: ReadonlySet<Permission>, match: MatchQuery) {
	if (typeof match === 'string' && match === Permission.DebugNeverGranted)
		return false;

	if (permissions.has(Permission.Admin))
		return true;

	if (typeof match === 'string')
		match = {type: 'any', items: [match]};
	else if (Array.isArray(match))
		match = {type: 'any', items: match};

	if (match.type === 'any')
		return isAnyGranted(permissions, match.items);
	else
		return isAllGranted(permissions, match.items);
}

function isAnyGranted(permissions: ReadonlySet<Permission>, items: Permission[]) {
	for (const item of items) {
		if (permissions.has(item))
			return true;
	}

	return false;
}

function isAllGranted(permissions: ReadonlySet<Permission>, items: Permission[]) {
	for (const item of items) {
		if (!permissions.has(item))
			return false;
	}

	return true;
}
