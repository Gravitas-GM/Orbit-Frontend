import { Button, Dialog, HTMLTable, Intent } from '@blueprintjs/core';
import { useCallback, useState, useEffect, useContext, useMemo } from 'react';
import { Board } from '../../../../../../Api/Game-Catalog/Models/Boards';
import { GamesModel, GameState, PlayerUpdate, UpdateResultType } from '../../../../../../Api/Game-State/Models/Games';
import { UserContext } from '../../../../../../Session';
import * as toaster from '../../../../../../Toaster';
import { FrameLoadingSpinner } from '../../../../../FrameLoadingSpinner';
import { PreviewRow } from './PreviewRow';

interface IProps {
	onClose: () => void;
	gameState: GameState;
	board: Board;
}

export const UpdatePreviewDialog: React.FC<IProps> = ({ gameState, board, onClose }) => {
	const User = useContext(UserContext);

	const [updateData, setUpdateData] = useState<PlayerUpdate[] | null>(null);

	const sortedData = useMemo(() => {
		if (updateData === null)
			return [];

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

		return [...otherItems, ...deletedItems];
	}, [updateData]);

	const fetchUpdateData = useCallback(async () => {
		let updateData: PlayerUpdate[];

		try {
			updateData = await GamesModel.updatePreview(User!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			onClose();

			return;
		}

		setUpdateData(updateData);
	}, []);

	useEffect(() => {
		fetchUpdateData();
	}, []);

	if (!updateData) {
		return (
			<Dialog title="Update Preview" icon="control" isOpen={true} onClose={onClose}>
				<div style={{ marginTop: '1rem' }}>
					<FrameLoadingSpinner />
				</div>
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
							{sortedData.map(
								update => <PreviewRow board={board} update={update}/>
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
