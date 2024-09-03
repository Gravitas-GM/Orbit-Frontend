export enum Role {
	Admin = 'ROLE_ADMIN',
	User = 'ROLE_USER',
	Service = 'ROLE_SERVICE',
}

export const ROLE_HIERARCHY: {[key in Role]?: Role[]} = {
	[Role.Admin]: [Role.User],
};

export function isRoleGranted(roles: ReadonlySet<Role>, match: Role, visited: Set<Role> = new Set()): boolean {
	if (roles.has(match))
		return true;

	for (const role of roles) {
		if (visited.has(role))
			throw new Error(`Found circular role hierarchy when testing ${role}`);

		visited.add(role);

		const children = ROLE_HIERARCHY[role] ?? [];

		if (children.length > 0 && isRoleGranted(new Set(children), match, visited))
			return true;
	}

	return false;
}
