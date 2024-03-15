import * as React from 'react';

export enum Permission {
	ADMIN = 'admin',
}

export interface PermissionMatch {
	items: Permission[];
	type?: 'any' | 'all';
}

export type MatchQuery = PermissionMatch | Permission | Permission[];

export function isGranted(permissions: Set<Permission>, match: MatchQuery) {
	if (permissions.has(Permission.ADMIN))
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

function isAnyGranted(permissions: Set<Permission>, items: Permission[]) {
	for (const item of items) {
		if (permissions.has(item))
			return true;
	}

	return false;
}

function isAllGranted(permissions: Set<Permission>, items: Permission[]) {
	for (const item of items) {
		if (!permissions.has(item))
			return false;
	}

	return true;
}

export type PermissionCheckCallback = (match: PermissionMatch | Permission | Permission[]) => boolean;

export const PermissionContext = React.createContext<[PermissionCheckCallback, Set<Permission>]>([
	() => false,
	new Set<Permission>(),
]);

PermissionContext.displayName = 'PermissionContext';
