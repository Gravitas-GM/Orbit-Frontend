import {Menu, MenuDivider} from '@blueprintjs/core';
import * as React from 'react';
import {Permission} from '../../Api/permissions';
import {usePermissions} from '../../contexts/SessionContext';
import {LinkedMenuItem} from './LinkedMenuItem';

export const GameMenu: React.FC = () => {
	const isPermissionGranted = usePermissions();

	return (
		<Menu>
			<LinkedMenuItem to="/game" icon="star" text="Game Board" />
			<LinkedMenuItem to="/leaderboard" icon="properties" text="Leaderboard" />

			{isPermissionGranted(Permission.Admin) && (
				<>
					<MenuDivider />

					<LinkedMenuItem to="/catalog" icon="layers" text="Game Catalog" />
					<LinkedMenuItem to="/sources" icon="bank-account" text="Sources" />
				</>
			)}
		</Menu>
	);
};

GameMenu.displayName = 'GameMenu';
