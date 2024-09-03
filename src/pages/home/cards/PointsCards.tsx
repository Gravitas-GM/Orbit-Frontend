import * as React from 'react';
import {UserClaimPointsDialog} from '../../../components/UserClaimPointsDialog';
import {NavCard, NavCardGroup} from './index';

export function PointsCards(): React.ReactElement {
	const [showDialog, setShowDialog] = React.useState(false);
	const onDialogOpen = React.useCallback(() => setShowDialog(true), []);
	const onDialogClose = React.useCallback(() => setShowDialog(false), []);

	return (
		<>
			<NavCardGroup>
				<NavCard
					icon="plus"
					title="Claim Points"
					body={<p>Claim points from activities.</p>}
					onClick={onDialogOpen}
				/>
			</NavCardGroup>

			<UserClaimPointsDialog onClose={onDialogClose} isOpen={showDialog} />
		</>
	);
}
