import {Button, Classes, Dialog, Intent} from '@blueprintjs/core';
import React, {useCallback, useState} from 'react';

interface ConfirmNextBoardProps {
	goToNextBoard: () => Promise<void>;
}

export function ConfirmNextBoardControl({goToNextBoard}: ConfirmNextBoardProps): React.ReactElement {
	const [showConfirmNextBoardDialog, setShowConfirmNextBoardDialog] = useState(false);
	const closeNextBoardDialog = useCallback(() => setShowConfirmNextBoardDialog(false), []);

	const confirmNextBoard = useCallback(() => {
		setShowConfirmNextBoardDialog(true);
	}, []);

	return (
		<>
			<Button
				title="Preview"
				intent={Intent.PRIMARY}
				onClick={confirmNextBoard}
			>
				Next Board
			</Button>

			{showConfirmNextBoardDialog && (
				<ConfirmNextBoardDialog
					onClose={closeNextBoardDialog}
					onConfirm={goToNextBoard}
				/>
			)}
		</>
	);
}

interface NextBoardDialogProps {
	onClose: () => void;
	onConfirm: () => Promise<void>;
}

export function ConfirmNextBoardDialog({onClose, onConfirm}: NextBoardDialogProps): React.ReactElement {
	const [processing, setIsProcessing] = useState(false);

	const onConfirmCallback = useCallback(async () => {
		setIsProcessing(true);

		await onConfirm();

		onClose();
		setIsProcessing(false);
	}, [onConfirm]);

	return (
		<Dialog isOpen title="Confirm move to next board" onClose={onClose}>
			<div className={Classes.DIALOG_BODY}>
				<p>
					Are you sure you want to move to the next board? This action cannot be undone.
				</p>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button onClick={onConfirmCallback} intent={Intent.PRIMARY} loading={processing}>
						Confirm
					</Button>

					<Button onClick={onClose} intent={Intent.DANGER} loading={processing}>
						Cancel
					</Button>
				</div>
			</div>
		</Dialog>
	);
}
