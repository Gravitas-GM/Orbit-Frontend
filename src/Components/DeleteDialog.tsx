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

	return (
		<Dialog
			isOpen={isOpen}
			title="Confirm Delete"
			onClose={onCancel}
		>
			<div className={Classes.DIALOG_BODY}>
				<p>
					You are about to delete "{subject}". This action cannot be reversed.
				</p>

				<p>
					To confirm, please type "{subject}" in the box below, then click "Confirm."
				</p>

				<InputGroup value={confirmText} onChange={event => setConfirmText(event.currentTarget.value)} />
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button text="Cancel" onClick={onCancel} />

					<Button
						text="Confirm"
						intent={Intent.WARNING}
						onClick={onConfirm}
						disabled={subject?.toLowerCase() !== confirmText.toLowerCase()}
					/>
				</div>
			</div>
		</Dialog>
	);
};
