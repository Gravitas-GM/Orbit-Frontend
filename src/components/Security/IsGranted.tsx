import * as React from 'react';
import {MatchQuery} from '../../api/permissions';
import {usePermissions} from '../../contexts/SessionContext';

interface Props {
	match: MatchQuery,
	children: React.ReactNode,
}

export function IsGranted({
	match,
	children,
}: Props): React.ReactElement | null {
	const isPermissionGranted = usePermissions();

	if (!isPermissionGranted(match))
		return null;

	return (
		<>{children}</>
	);
}
