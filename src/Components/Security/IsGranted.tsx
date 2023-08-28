import * as React from 'react';
import {MatchQuery, PermissionContext} from '../../Permission';

interface Props {
	match: MatchQuery,
	children: React.ReactNode,
}

export function IsGranted({match, children}: Props): React.ReactElement {
	return (
		<PermissionContext.Consumer>
			{([isGranted]) => isGranted(match) && children}
		</PermissionContext.Consumer>
	);
}