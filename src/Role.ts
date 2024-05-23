import * as React from 'react';

export enum Role {
	ADMIN = 'ROLE_ADMIN',
	USER = 'ROLE_USER',
	SERVICE = 'ROLE_SERVICE',
}

const HIERARCHY: {[key in Role]?: Role[]} = {
	[Role.ADMIN]: [Role.USER],
};

export interface RoleMatch {
	items: Role[],
	type?: 'any' | 'all',
}

export function isRoleGranted(roles: Set<Role>, match: Role, visited: Set<Role> = new Set()): boolean {
	if (roles.has(match))
		return true;

	for (const role of roles) {
		if (visited.has(role))
			throw new Error(`Recursive role hierarchy encountered for ${role}`);

		visited.add(role);

		const children = HIERARCHY[role] ?? [];

		if (children.length > 0 && isRoleGranted(new Set(children), match, visited))
			return true;
	}

	return false;
}

export type RoleCheckCallback = (match: Role) => boolean;

export const RoleContext = React.createContext<[RoleCheckCallback, Set<Role>]>([
	() => false,
	new Set(),
]);

RoleContext.displayName = 'RoleContext';
