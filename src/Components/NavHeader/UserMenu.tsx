import {Menu, MenuDivider} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2/lib/esm/menuItem2';
import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {Permission} from '../../Api/permissions';
import {Config} from '../../config';
import {usePermissions} from '../../contexts/SessionContext';
import {useToken} from '../../contexts/TokenContext';
import {LinkedMenuItem} from './LinkedMenuItem';

export const UserMenu: React.FC = () => {
	const [redirect, setRedirect] = React.useState<string | null>(null);
	const {setToken} = useToken();
	const isPermissionGranted = usePermissions();

	const logout = React.useCallback(() => {
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
				<LinkedMenuItem to="/debug-controls" icon="console" text="Debug Controls" />
			)}

			<MenuDivider />

			<MenuItem
				text="Log Out"
				icon="log-out"
				onClick={logout}
			/>
		</Menu>
	);
};

UserMenu.displayName = 'UserMenu';
