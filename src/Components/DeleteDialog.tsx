import {Button, Classes, Dialog, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';

interface IProps {
	isOpen: boolean,
	subject: string | undefined,
	multiple?: boolean,
	onConfirm: () => Promise<void>,
	onCancel: () => void,
}

export const DeleteDialog: React.FC<IProps> = ({isOpen, subject, multiple = false, onConfirm, onCancel}) => {
	let [confirmText, setConfirmText] = React.useState('');
	const [processing, setIsProcessing] = React.useState(false)

	let onCancelCallback = React.useCallback(() => {
		setConfirmText('');
		onCancel();
		setIsProcessing(false)
	}, [onCancel, setConfirmText]);

	let onConfirmCallback = React.useCallback(async () => {
		setIsProcessing(true)
		await onConfirm();
		setConfirmText('');
		setIsProcessing(false)
	}, [onConfirm, setConfirmText]);

	let onConfirmTextChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => setConfirmText(event.currentTarget.value),
		[setConfirmText],
	);

	return (
		<Dialog
			isOpen={isOpen}
			title="Confirm Delete"
			onClose={onCancelCallback}
			isCloseButtonShown={!processing}
		>
			<div className={Classes.DIALOG_BODY}>
				<p>
					You are about to delete {multiple ? 'multiple items' : `"${subject}"`}. This action cannot be reversed.
				</p>

				<p>
					To confirm, please type "{multiple ? 'DELETE' : subject}" in the box below, then click "Confirm."
				</p>

				<InputGroup value={confirmText} onChange={onConfirmTextChange} autoFocus={true} />
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button text="Cancel" onClick={onCancelCallback} disabled={processing} loading={processing} />

					<Button
						text="Confirm"
						intent={Intent.WARNING}
						onClick={onConfirmCallback}
						loading={processing}
						disabled={subject !== confirmText || processing}
					/>
				</div>
			</div>
		</Dialog>
	);
};
