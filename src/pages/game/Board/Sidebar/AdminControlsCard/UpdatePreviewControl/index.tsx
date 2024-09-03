import {Button, Intent} from '@blueprintjs/core';
import React, {useCallback, useState} from 'react';
import {Board} from '../../../../../../api/Game-Catalog/Models/Boards';
import {UpdatePreviewDialog} from './UpdatePreviewDialog';

interface Props {
	board: Board;
}

export function UpdatePreviewControl({board}: Props): React.ReactElement {
	const [showUpdatePreviewDialog, setShowUpdatePreviewDialog] = useState(false);

	const onPreviewClick = useCallback(() => {
		setShowUpdatePreviewDialog(true);
	}, []);

	const closePreviewDialog = useCallback(() => {
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
