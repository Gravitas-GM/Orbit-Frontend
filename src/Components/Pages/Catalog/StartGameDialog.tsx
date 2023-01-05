import { Button, Classes, Dialog, InputGroup, Intent } from '@blueprintjs/core';
import * as React from 'react';
import { Game } from '../../../Api/Game-Catalog/Models/Games';

interface IProps {
	isOpen: boolean;
	processing: boolean;
	onConfirm: () => Promise<void>;
	onCancel: () => void;
	game: Game;
}

export const StartGameDialog: React.FC<IProps> = ({ isOpen, game, processing, onConfirm, onCancel }) => {
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
			title="Confirm Start Game"
			onClose={onCancelCallback}
		>
			<div className={Classes.DIALOG_BODY}>
				<p>
					Would you like to start {game.name}? This will reset all points for all users and start a new game.
				</p>

				<p>
					To confirm, please type "{game.name}" in the box below, then click "Confirm."
				</p>

				<InputGroup value={confirmText} onChange={onConfirmTextChange} autoFocus={true} />
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button text="Cancel" onClick={onCancelCallback} disabled={processing} />

					<Button
						text="Start Game"
						intent={Intent.PRIMARY}
						onClick={onConfirmCallback}
						disabled={game.name !== confirmText}
						loading={processing}
					/>
				</div>
			</div>
		</Dialog>
	);
};
