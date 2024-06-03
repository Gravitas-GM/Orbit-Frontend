import * as React from 'react';
import {SessionManager} from './SessionContext';
import {TokenManager} from './TokenContext';

export interface ManagerProps {
	children: React.ReactNode,
}

export function GlobalContexts({children}: ManagerProps): React.ReactElement {
	return (
		<TokenManager>
			<SessionManager>
				{children}
			</SessionManager>
		</TokenManager>
	);
}
