import {Menu, MenuDivider, MenuItem} from '@blueprintjs/core';
import {ReactElement, useCallback, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {Permission} from '../../api/permissions';
import {Config} from '../../config';
import {usePermissions} from '../../contexts/SessionContext';
import {useToken} from '../../contexts/TokenContext';
import {LinkedMenuItem} from './LinkedMenuItem';

export function UserMenu(): ReactElement {
	const [redirect, setRedirect] = useState<string | null>(null);
	const {setToken} = useToken();
	const isPermissionGranted = usePermissions();

	const logout = useCallback(() => {
		setToken(null);
		setRedirect('/login');
	}, []);

	if (redirect)
		return <Navigate to={redirect} />;

	return (
		<Menu>
			<MenuItem
				text="Settings"
				icon="person"
			/>

			{Config.isDev && isPermissionGranted(Permission.Admin) && (
				<LinkedMenuItem to="/debug" icon="console" text="Debug Controls" />
			)}

			<MenuDivider />

			<MenuItem
				text="Log Out"
				icon="log-out"
				onClick={logout}
			/>
		</Menu>
	);
}
