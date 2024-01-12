import * as React from 'react';
import {Card, Icon, Intent, H4} from '@blueprintjs/core';
import {CardsGroup} from './CardsGroup';
import {UserClaimPointsDialog} from '../Pages/UserClaimPointsDialog';

export const DefaultCards: React.FC = () => {
	const [showDialog, setShowDialog] = React.useState(false);

	const onDialogOpen = React.useCallback(() => setShowDialog(true), []);
	const onDialogClose = React.useCallback(() => setShowDialog(false), []);

	return (
		<CardsGroup>
			<Card interactive={true} onClick={onDialogOpen}>
				<Icon icon="plus" size={35} intent={Intent.PRIMARY} />
				<div>
					<H4>Claim Points</H4>

					<p>Claim points from activities.</p>
				</div>
			</Card>

			<UserClaimPointsDialog onClose={onDialogClose} isOpen={showDialog} />
		</CardsGroup>
	);
};
