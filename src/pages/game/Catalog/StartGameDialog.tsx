import {Button, Classes, Dialog, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Game} from '../../../api/Game-Catalog/Models/Games';

interface Props {
	isOpen: boolean;
	processing: boolean;
	onConfirm: () => Promise<void>;
	onCancel: () => void;
	game: Game;
}

export function StartGameDialog({isOpen, game, processing, onConfirm, onCancel}: Props) {
	return (
		<Dialog
			isOpen={isOpen}
			title="Start Game"
			onClose={onCancel}
		>
			<div className={Classes.DIALOG_BODY}>
				<p style={{lineHeight: '175%'}}>
					Would you like to start {game.name}?<br />
					This will reset all points for all users and start a new game.
				</p>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button
						text="Cancel"
						onClick={onCancel}
						loading={processing}
					/>

					<Button
						text="Start Game"
						intent={Intent.PRIMARY}
						onClick={onConfirm}
						loading={processing}
					/>
				</div>
			</div>
		</Dialog>
	);
}
