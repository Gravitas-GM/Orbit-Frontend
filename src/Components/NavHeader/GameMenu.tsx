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
			<LinkedMenuItem to="/game/leaderboard" icon="properties" text="Leaderboard" />

			{isPermissionGranted(Permission.Admin) && (
				<>
					<MenuDivider />

					<LinkedMenuItem to="/game/catalog" icon="layers" text="Game Catalog" />
					<LinkedMenuItem to="/game/sources" icon="bank-account" text="Sources" />
				</>
			)}
		</Menu>
	);
};

GameMenu.displayName = 'GameMenu';
