import { Button, Dialog, HTMLTable, Intent } from '@blueprintjs/core';
import { useState, useEffect, useContext } from 'react';
import { Board } from '../../../../../../Api/Game-Catalog/Models/Boards';
import { GamesModel, PlayerUpdate, UpdateResultType } from '../../../../../../Api/Game-State/Models/Games';
import { UserContext } from '../../../../../../Session';
import * as toaster from '../../../../../../Toaster';
import { FrameLoadingSpinner } from '../../../../../FrameLoadingSpinner';
import { PreviewRow } from './PreviewRow';
import { NonIdealState } from '../../../../../NonIdealState';

interface IProps {
	onClose: () => void;
	board: Board;
}

export const UpdatePreviewDialog: React.FC<IProps> = ({ board, onClose }) => {
	const User = useContext(UserContext);

	const [updateData, setUpdateData] = useState<PlayerUpdate[]>([]);

	const [processing, setIsProcessing] = useState(false);

	useEffect(() => {
		const fetchUpdateData = async () => {
			if (processing)
				return;

			setIsProcessing(true);

			let updateData: PlayerUpdate[];

			try {
				updateData = await GamesModel.updatePreview(User!.account.id).then(response => response.data);
			} catch (_) {
				toaster.showUnhandledErrorMessage();

				onClose();

				setIsProcessing(false);

				return;
			}

			const deletedItems = updateData?.filter(item => item.type === UpdateResultType.DELETED);
			const otherItems = updateData.filter(item => item.type !== UpdateResultType.DELETED);

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

			const sortedUpdateData = [...otherItems, ...deletedItems];

			setUpdateData(sortedUpdateData);

			setIsProcessing(false);
		};

		fetchUpdateData();
	}, []);

	if (processing) {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
				<div style={{ marginTop: '1rem' }}>
					<FrameLoadingSpinner />
				</div>
			</Dialog>
		);
	}

	if (updateData.length === 0) {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
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
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
				<div style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
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
								update => <PreviewRow board={board} update={update} key={update.player.hub_id} />
							)}
						</tbody>
					</HTMLTable>
				</div>

				<Button onClick={onClose} intent={Intent.PRIMARY} style={{ margin: '0 1rem' }}>
					Close
				</Button>
			</Dialog>
		);
	}
};
