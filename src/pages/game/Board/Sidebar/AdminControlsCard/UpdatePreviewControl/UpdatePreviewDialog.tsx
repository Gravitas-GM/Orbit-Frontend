import {Button, Dialog, HTMLTable, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Board} from '../../../../../../api/Game-Catalog/Models/Boards';
import {
	GamesModel,
		getPlayerIdFromPlayerUpdate,
	getNewPointsFromPlayerUpdate,
	PlayerUpdate,
	UpdateResultType,
} from '../../../../../../api/Game-State/Models/Games';
import {Classes} from '../../../../../../classes';
import {FrameLoadingSpinner} from '../../../../../../components/FrameLoadingSpinner';
import {NonIdealState} from '../../../../../../components/NonIdealState';
import {useAppUser} from '../../../../../../contexts/SessionContext';
import {Spacing} from '../../../../../../Styles/variables';
import {toaster} from '../../../../../../toaster';
import {PreviewRow} from './PreviewRow';
import './UpdatePreviewDialog.scss';

interface Props {
	onClose: () => void;
	board: Board;
}

export function UpdatePreviewDialog({board, onClose}: Props): React.ReactElement {
	const user = useAppUser();

	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		setProcessing(true);

		GamesModel.updatePreview(user.account.id)
			.then(r => setUpdateData(sortUpdateData(r.data)))
			.then(() => setProcessing(false))
			.catch(() => {
				toaster.showUnhandledErrorMessage();

				onClose();
			});
	}, [user]);

	let content: React.ReactNode;

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
						{updateData.map(update => (
							<PreviewRow
								board={board}
								update={update}
								key={getPlayerIdFromPlayerUpdate(update)}
							/>
						))}
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
