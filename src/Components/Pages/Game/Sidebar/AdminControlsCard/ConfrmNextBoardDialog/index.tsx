import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

interface IProps {
	onClose: () => void;
	moveToNextBoard: () => void;
}

export const ConfirmNextBoardDialog: React.FC<IProps> = ({ onClose, moveToNextBoard }) => {
	return (
		<Dialog isOpen title="Confirm move to next board" onClose={onClose}>
			<div className={Classes.DIALOG_BODY}>
				<p>
					This will move all players to the next board. <span>(This action cannot be undone)</span>
				</p>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button onClick={moveToNextBoard} intent={Intent.PRIMARY}>
						Confirm
					</Button>

					<Button onClick={onClose} intent={Intent.DANGER}>
						Cancel
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
