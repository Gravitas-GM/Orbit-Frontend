import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { useCallback, useState } from 'react';

interface INextBoardProps {
	goToNextBoard: ()=> Promise<void>;
}

export const ConfirmNextBoardControl: React.FC<INextBoardProps> = ({ goToNextBoard }) => {

	const [showConfirmNextBoardDialog, setShowConfirmNextBoardDialog] = useState(false);
	const closeNextBoardDialog = useCallback(() => setShowConfirmNextBoardDialog(false), []);

	const confirmNextBoard = useCallback(() => {
		setShowConfirmNextBoardDialog(true);
	}, []);

	return(
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
	)
}

interface INextBoardDialogProps {
	onClose: () => void;
	onConfirm: () => Promise<void>;
}

export const ConfirmNextBoardDialog: React.FC<INextBoardDialogProps> = ({ onClose, onConfirm }) => {
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
};
