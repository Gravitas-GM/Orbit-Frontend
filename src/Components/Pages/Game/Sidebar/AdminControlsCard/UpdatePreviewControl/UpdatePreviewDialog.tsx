import * as React from 'react';
import {Dialog, Button, Intent, HTMLTable} from '@blueprintjs/core';
import {NonIdealState} from '../../../../../NonIdealState';
import {useContext, useState, useEffect} from 'react';
import {PlayerUpdate, GamesModel, UpdateResultType} from '../../../../../../Api/Game-State/Models/Games';
import {Board} from '../../../../../../Api/Game-Catalog/Models/Boards';
import {UserContext} from '../../../../../../Session';
import {FrameLoadingSpinner} from '../../../../../FrameLoadingSpinner';
import {PreviewRow} from './PreviewRow';
import * as toaster from '../../../../../../Toaster';
import './UpdatePreviewDialog.scss';
import {Spacing} from '../../../../../../Styles/variables';

interface IUpdatePreviewDialogProps {
	onClose: () => void;
	board: Board;
}

export const UpdatePreviewDialog: React.FC<IUpdatePreviewDialogProps> = ({board, onClose}) => {
	const User = useContext(UserContext);

	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);
	const [processing, setIsProcessing] = useState(false);

	useEffect(() => {
		setIsProcessing(true);

		GamesModel.updatePreview(User!.account.id)
			.then(r => setUpdateData(sortUpdateData(r.data)))
			.then(() => setIsProcessing(false))
			.catch(() => {
				toaster.showUnhandledErrorMessage();

				onClose();
			});
	}, [User]);

	if (processing) {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose} className="gm-dialog-large">
				<div style={{margin: Spacing.Large}}>
					<FrameLoadingSpinner />
				</div>
			</Dialog>
		);
	}

	if (!updateData || updateData.length === 0) {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose} className="gm-dialog-large">
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
			</Dialog>
		);
	} else {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose} className="gm-dialog-large">
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
			</Dialog>
		);
	}
};

function sortUpdateData(data: PlayerUpdate[]) {
	const deletedItems = data.filter(item => item.type === UpdateResultType.DELETED);
	const otherItems = data.filter(item => item.type !== UpdateResultType.DELETED);

	otherItems.sort((playerA: PlayerUpdate, playerB: PlayerUpdate) => {
		let playerAPoints;
		let playerBPoints;

		switch (playerA.type) {
			case UpdateResultType.CHANGED:
				playerAPoints = playerA.new_point_total;
				break;
			case UpdateResultType.MOVED:
				playerAPoints = playerA.new_point_total;
				break;
			default:
				playerAPoints = 0;
				break;
		}

		switch (playerB.type) {
			case UpdateResultType.CHANGED:
				playerBPoints = playerB.new_point_total;
				break;
			case UpdateResultType.MOVED:
				playerBPoints = playerB.new_point_total;
				break;
			default:
				playerBPoints = 0;
				break;
		}

		return playerAPoints - playerBPoints;
	});

	return [...otherItems, ...deletedItems];
}