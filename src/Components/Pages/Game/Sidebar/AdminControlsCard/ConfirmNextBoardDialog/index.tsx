import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { useCallback, useState } from 'react';

interface IProps {
	onClose: () => void;
	onConfirm: () => Promise<void>;
}

export const ConfirmNextBoardDialog: React.FC<IProps> = ({ onClose, onConfirm }) => {
	const [processing, setIsProcessing] = useState(false);

	const onConfirmCallback = useCallback(async () => {
		setIsProcessing(true);

		await onConfirm();

		setIsProcessing(false);
	}, [onConfirm])

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