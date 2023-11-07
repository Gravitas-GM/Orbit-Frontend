import * as React from 'react';
import {Permission, PermissionContext} from '../../Permission';
import {Menu, MenuDivider} from '@blueprintjs/core';
import {LinkedMenuItem} from './LinkedMenuItem';

export const GameMenu: React.FC = () => {
	const [isGranted] = React.useContext(PermissionContext);

	return (
		<Menu>
			<LinkedMenuItem to="/game" icon="star" text="Game Board" />
			<LinkedMenuItem to="/leaderboard" icon="properties" text="Leaderboard" />

			{isGranted(Permission.ADMIN) && (
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
