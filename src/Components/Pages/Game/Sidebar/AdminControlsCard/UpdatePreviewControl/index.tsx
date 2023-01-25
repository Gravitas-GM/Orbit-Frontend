import { Button, Intent } from '@blueprintjs/core';
import { useState, useCallback } from 'react';
import { Board } from '../../../../../../Api/Game-Catalog/Models/Boards';
import { UpdatePreviewDialog } from './UpdatePreviewDialog';

interface IUpdatePreviewProps {
	board: Board;
}

export const UpdatePreviewControl: React.FC<IUpdatePreviewProps> = ({ board }) => {
	const [showUpdatePreviewDialog, setShowUpdatePreviewDialog] = useState(false);

	const onPreviewClick = useCallback(async () => {
		setShowUpdatePreviewDialog(true);
	}, []);

	const closePreviewDialog = useCallback(async () => {
		setShowUpdatePreviewDialog(false);
	}, []);

	return (
		<>
			<Button
				title="Preview"
				intent={Intent.PRIMARY}
				onClick={onPreviewClick}
			>
				Preview
			</Button>

			{showUpdatePreviewDialog && (
				<UpdatePreviewDialog
					board={board}
					onClose={closePreviewDialog}
				/>
			)}
		</>
	);
}
