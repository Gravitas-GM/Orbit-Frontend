import * as React from 'react';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2/lib/esm/menuItem2';
import {Permission, PermissionContext} from '../../Permission';
import {Menu, MenuDivider} from '@blueprintjs/core';
import {UserClaimPointsDialog} from '../Pages/UserClaimPointsDialog';
import {LinkedMenuItem} from './LinkedMenuItem';

export const GameMenu: React.FC = () => {
	const [isGranted] = React.useContext(PermissionContext);
	const [showDialog, setShowDialog] = React.useState(false);

	const onDialogOpen = React.useCallback(() => setShowDialog(true), []);
	const onDialogClose = React.useCallback(() => setShowDialog(false), []);

	return (
		<>
			<Menu>
				<MenuItem
					icon="plus"
					text="Claim Points"
					onClick={onDialogOpen}
				/>

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

			<UserClaimPointsDialog onClose={onDialogClose} isOpen={showDialog} />
		</>
	);
};

GameMenu.displayName = 'GameMenu';
