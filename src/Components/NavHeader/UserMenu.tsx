import * as React from 'react';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2/lib/esm/menuItem2';
import {Config} from '../../config';
import {Permission, PermissionContext} from '../../Permission';
import {Menu, MenuDivider} from '@blueprintjs/core';
import {logout} from '../../Api';
import {LinkedMenuItem} from './LinkedMenuItem';

export const UserMenu: React.FC = () => {
	const [isGranted] = React.useContext(PermissionContext);

	return (
		<Menu>
			<MenuItem
				text="Settings"
				icon="person"
			/>

			{Config.isDev && isGranted(Permission.ADMIN) &&
				<LinkedMenuItem to="/debug-controls" icon="console" text="Debug Controls" />
			}

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