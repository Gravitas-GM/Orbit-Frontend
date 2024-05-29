import {Button, Dialog, HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Board} from '../../../../../../Api/Game-Catalog/Models/Boards';
import {
	GamesModel,
	getNewPointsFromPlayerUpdate,
	PlayerUpdate,
	UpdateResultType,
} from '../../../../../../Api/Game-State/Models/Games';
import {Classes} from '../../../../../../classes';
import {FrameLoadingSpinner} from '../../../../../../Components/FrameLoadingSpinner';
import {NonIdealState} from '../../../../../../Components/NonIdealState';
import {useAppUser} from '../../../../../../contexts/SessionContext';
import {Spacing} from '../../../../../../Styles/variables';
import {toaster} from '../../../../../../toaster';
import './UpdatePreviewDialog.scss';
import {PreviewRow} from './PreviewRow';

interface Props {
	onClose: () => void;
	board: Board;
}

export function UpdatePreviewDialog({board, onClose}: Props): React.ReactElement {
	const user = useAppUser();

	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		if (!user)
			return;

		setProcessing(true);

		GamesModel.updatePreview(user!.account.id)
			.then(r => setUpdateData(sortUpdateData(r.data)))
			.then(() => setProcessing(false))
			.catch(() => {
				toaster.showUnhandledErrorMessage();

				onClose();
			});
	}, [user]);

	let content: React.ReactNode = null;

	if (processing) {
		content = (
			<div style={{margin: Spacing.Large}}>
				<FrameLoadingSpinner />
			</div>
		);
	} else if (!updateData || updateData.length === 0) {
		content = (
			<NonIdealState
				title="No preview data available"
				action={(
					<Button
						text="Close"
						onClick={onClose}
						intent={Intent.PRIMARY}
					/>
				)}
			/>
		);
	} else {
		content = (
			<div className="table-container">
				<HTMLTable striped>
					<thead>
						<tr>
							<th>Name</th>
							<th>Status</th>
							<th>Current Points</th>
							<th>Current Stage</th>
							<th>New Points</th>
							<th>New Stage</th>
						</tr>
					</thead>

					<tbody>
						{updateData.map(
							update => <PreviewRow
								board={board}
								update={update}
								key={update.player.hub_id}
							/>,
						)}
					</tbody>
				</HTMLTable>
			</div>
		);
	}

	return (
		<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose} className={Classes.DIALOG_LARGE}>
			{content}
		</Dialog>
	);
}

function sortUpdateData(data: PlayerUpdate[]) {
	const deletedItems = data.filter(item => item.type === UpdateResultType.DELETED);
	const otherItems = data
		.filter(item => item.type !== UpdateResultType.DELETED)
		.sort((playerA: PlayerUpdate, playerB: PlayerUpdate) => {
			const a = getNewPointsFromPlayerUpdate(playerA);
			const b = getNewPointsFromPlayerUpdate(playerB);

			return a - b;
		});

	return [...otherItems, ...deletedItems];
}
