import {ReactNode} from 'react';
import {MatchQuery} from '../../api/permissions';
import {usePermissions} from '../../contexts/SessionContext';

export function withPermissionRestriction(permission: MatchQuery, elements: ReactNode): ReactNode {
	const isPermissionGranted = usePermissions();

	if (!isPermissionGranted(permission))
		return null;

	return elements;
}
