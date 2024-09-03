import {ReactNode} from 'react';
import {Role} from '../../api/roles';
import {useFirewallRoles} from '../../contexts/SessionContext';

export function withRoleRestriction(role: Role, elements: ReactNode): ReactNode {
	const isRoleGranted = useFirewallRoles();

	if (!isRoleGranted(role))
		return null;

	return elements;
}
