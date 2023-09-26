import {Button, Classes, Dialog, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';

interface IProps {
	isOpen: boolean,
	subject: string | undefined | null,
	multiple?: boolean,
	onConfirm: () => Promise<void>,
	onCancel: () => void,
	children?: React.ReactNode;
}

export const DeleteDialog: React.FC<IProps> = ({isOpen, subject, multiple = false, onConfirm, onCancel, children}) => {
	const [confirmText, setConfirmText] = React.useState('');
	const [processing, setProcessing] = React.useState(false);

	const onCancelCallback = React.useCallback(() => {
		setConfirmText('');
		onCancel();
		setProcessing(false);
	}, [onCancel, setConfirmText]);

	const onConfirmCallback = React.useCallback(async () => {
		setProcessing(true);
		await onConfirm();
		setConfirmText('');
		setProcessing(false);
	}, [onConfirm, setConfirmText]);

	const onConfirmTextChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => setConfirmText(event.currentTarget.value),
		[setConfirmText],
	);

	return (
		<Dialog
			isOpen={isOpen}
			title="Confirm Delete"
			onClose={onCancelCallback}
			isCloseButtonShown={!processing}
			canEscapeKeyClose={!processing}
			canOutsideClickClose={!processing}
		>
			<form onSubmit={(event) => event.preventDefault()}>
				<div className={Classes.DIALOG_BODY}>
					{children ?? (
						<>
							<p>
								You are about to delete {multiple ? 'multiple items' : `"${subject}"`}. This action
								cannot be
								reversed.
							</p>

							<p>
								To confirm, please type "{multiple ? 'Delete' : subject}" in the box below, then click
								"Confirm."
							</p>
						</>
					)}

					<InputGroup value={confirmText} onChange={onConfirmTextChange} autoFocus={true} />
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={onCancelCallback} disabled={processing} loading={processing} />

						<Button
							type="submit"
							text="Confirm"
							intent={Intent.WARNING}
							onClick={onConfirmCallback}
							loading={processing}
							disabled={processing || subject?.toLowerCase() !== confirmText.toLowerCase()}
						/>
					</div>
				</div>
			</form>
		</Dialog>
	);
};
