import {Button, Classes, Dialog, FormGroup, Intent, MenuItem} from '@blueprintjs/core';
import {ItemRenderer, Select} from '@blueprintjs/select';
import React, {useCallback, useMemo, useState} from 'react';
import {PlayerState} from '../../../../../api/Game-State/Models/Games';
import {toaster} from '../../../../../toaster';

interface Props {
	players: PlayerState[];
	hidePlayerFromBoard: (playerId: number) => Promise<void>;
}

export function RemoveFromBoardControl({players, hidePlayerFromBoard}: Props): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button
				intent={Intent.DANGER}
				onClick={onOpen}
				disabled={players.length === 0}
				title="Remove a player marker from the board"
			>
				Remove from board
			</Button>

			{isOpen && (
				<RemoveFromBoardDialog
					players={players}
					hidePlayerFromBoard={hidePlayerFromBoard}
					onClose={onClose}
				/>
			)}
		</>
	);
}

interface DialogProps {
	players: PlayerState[];
	hidePlayerFromBoard: (playerId: number) => Promise<void>;
	onClose: () => void;
}

function RemoveFromBoardDialog({players, hidePlayerFromBoard, onClose}: DialogProps): React.ReactElement {
	const [selected, setSelected] = useState<PlayerState | null>(null);
	const [processing, setProcessing] = useState(false);

	const sortedPlayers = useMemo(() => {
		return [...players].sort((a, b) => a.user_name.localeCompare(b.user_name));
	}, [players]);

	const onConfirm = useCallback(async () => {
		if (!selected)
			return;

		setProcessing(true);

		try {
			await hidePlayerFromBoard(Number(selected.hub_id));
			onClose();
		} catch (e) {
			toaster.showApiErrorMessage(e);
		} finally {
			setProcessing(false);
		}
	}, [selected, hidePlayerFromBoard, onClose]);

	return (
		<Dialog isOpen title="Remove player from board" onClose={onClose} canOutsideClickClose={!processing}>
			<div className={Classes.DIALOG_BODY}>
				<p>
					This will <strong>hide</strong> the selected player’s marker from the board for your account.
					The user is not deleted from the system.
				</p>

				<FormGroup label="Player" labelFor="remove-player-select">
					<Select<PlayerState>
						items={sortedPlayers}
						onItemSelect={player => setSelected(player)}
						filterable={false}
						itemRenderer={renderPlayerOption}
						noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
					>
						<Button
							id="remove-player-select"
							fill={true}
							text={selected ? selected.user_name : 'Select a player'}
							rightIcon="caret-down"
							alignText="left"
						/>
					</Select>
				</FormGroup>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button onClick={onClose} disabled={processing}>
						Cancel
					</Button>

					<Button
						intent={Intent.DANGER}
						onClick={onConfirm}
						disabled={!selected}
						loading={processing}
					>
						Remove
					</Button>
				</div>
			</div>
		</Dialog>
	);
}

const renderPlayerOption: ItemRenderer<PlayerState> = (player, {handleClick, handleFocus, modifiers}) => {
	if (!modifiers.matchesPredicate)
		return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={String(player.hub_id)}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={player.user_name}
		/>
	);
};
