import * as React from 'react';

export enum Role {
	ADMIN = 'ROLE_ADMIN',
	USER = 'ROLE_USER',
	SERVICE = 'ROLE_SERVICE',
}

export type MatchQuery = Role | Role[];

export function hasRole(roles: Set<Role>, match: MatchQuery) {
	if (typeof match === 'string')
		return roles.has(match);

	for (const item of match) {
		if (roles.has(item))
			return true;
	}

	return false;
}

export type RoleCheckCallback = (match: Role | Role[]) => boolean;

export const RoleContext = React.createContext<[RoleCheckCallback, Set<Role>]>([() => false, new Set<Role>()]);

RoleContext.displayName = 'RoleContext';
