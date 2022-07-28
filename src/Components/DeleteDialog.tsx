import {Button, Classes, Dialog, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';

interface IProps {
	isOpen: boolean,
	subject: string | undefined,
	onConfirm: () => void,
	onCancel: () => void,
}

export const DeleteDialog: React.FC<IProps> = ({isOpen, subject, onConfirm, onCancel}) => {
	let [confirmText, setConfirmText] = React.useState('');

	let onCancelCallback = React.useCallback(() => {
		setConfirmText('');
		onCancel();
	}, [onCancel, setConfirmText]);

	let onConfirmCallback = React.useCallback(() => {
		setConfirmText('');
		onConfirm();
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
		>
			<div className={Classes.DIALOG_BODY}>
				<p>
					You are about to delete "{subject}". This action cannot be reversed.
				</p>

				<p>
					To confirm, please type "{subject}" in the box below, then click "Confirm."
				</p>

				<InputGroup value={confirmText} onChange={onConfirmTextChange} autoFocus={true} />
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button text="Cancel" onClick={onCancelCallback} />

					<Button
						text="Confirm"
						intent={Intent.WARNING}
						onClick={onConfirmCallback}
						disabled={subject !== confirmText}
					/>
				</div>
			</div>
		</Dialog>
	);
};
