import * as React from 'react';
import {LoadingManager} from './LoadingContext';
import {SessionManager} from './SessionContext';
import {TokenManager} from './TokenContext';

export interface ManagerProps {
	children: React.ReactNode,
}

export function GlobalContexts({children}: ManagerProps): React.ReactElement {
	return (
		<LoadingManager>
			<TokenManager>
				<SessionManager>
					{children}
				</SessionManager>
			</TokenManager>
		</LoadingManager>
	);
}
