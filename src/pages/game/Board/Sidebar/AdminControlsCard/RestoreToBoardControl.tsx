import {Button, Classes, Dialog, FormGroup, Intent, MenuItem} from '@blueprintjs/core';
import {ItemRenderer, Select} from '@blueprintjs/select';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {GamesModel, HiddenPlayerState} from '../../../../../api/Game-State/Models/Games';
import {toaster} from '../../../../../toaster';

interface Props {
	accountId: number;
	unhidePlayerFromBoard: (playerId: number) => Promise<void>;
}

export function RestoreToBoardControl({accountId, unhidePlayerFromBoard}: Props): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button
				intent={Intent.PRIMARY}
				onClick={onOpen}
				title="Restore a previously removed player marker to the board"
			>
				Restore to board
			</Button>

			{isOpen && (
				<RestoreToBoardDialog
					accountId={accountId}
					unhidePlayerFromBoard={unhidePlayerFromBoard}
					onClose={onClose}
				/>
			)}
		</>
	);
}

interface DialogProps {
	accountId: number;
	unhidePlayerFromBoard: (playerId: number) => Promise<void>;
	onClose: () => void;
}

function RestoreToBoardDialog({accountId, unhidePlayerFromBoard, onClose}: DialogProps): React.ReactElement {
	const [hiddenPlayers, setHiddenPlayers] = useState<HiddenPlayerState[] | null>(null);
	const [selected, setSelected] = useState<HiddenPlayerState | null>(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		let cancelled = false;

		setLoading(true);

		GamesModel.hiddenPlayers(accountId)
			.then(r => {
				if (cancelled)
					return;
				setHiddenPlayers(r.data);
			})
			.catch(e => {
				if (cancelled)
					return;
				toaster.showApiErrorMessage(e);
				onClose();
			})
			.finally(() => {
				if (cancelled)
					return;
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [accountId, onClose]);

	const sortedPlayers = useMemo(() => {
		if (!hiddenPlayers)
			return [];
		return [...hiddenPlayers].sort((a, b) => String(a.user_name).localeCompare(String(b.user_name)));
	}, [hiddenPlayers]);

	const onConfirm = useCallback(async () => {
		if (!selected)
			return;

		setProcessing(true);

		try {
			await unhidePlayerFromBoard(Number(selected.hub_id));
			onClose();
		} catch (e) {
			toaster.showApiErrorMessage(e);
		} finally {
			setProcessing(false);
		}
	}, [selected, unhidePlayerFromBoard, onClose]);

	return (
		<Dialog isOpen title="Restore player to board" onClose={onClose} canOutsideClickClose={!processing}>
			<div className={Classes.DIALOG_BODY}>
				<p>
					This will <strong>restore</strong> a previously removed player marker back to the board for your account.
				</p>

				{loading ? (
					<p>Loading hidden players…</p>
				) : (
					<FormGroup label="Hidden player" labelFor="restore-player-select">
						<Select<HiddenPlayerState>
							items={sortedPlayers}
							onItemSelect={player => setSelected(player)}
							filterable={false}
							itemRenderer={renderHiddenPlayerOption}
							noResults={<MenuItem disabled={true} text="No hidden players." roleStructure="listoption" />}
						>
							<Button
								id="restore-player-select"
								fill={true}
								text={selected ? selected.user_name : 'Select a player'}
								rightIcon="caret-down"
								alignText="left"
								disabled={sortedPlayers.length === 0}
							/>
						</Select>
					</FormGroup>
				)}
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button onClick={onClose} disabled={processing}>
						Cancel
					</Button>

					<Button
						intent={Intent.PRIMARY}
						onClick={onConfirm}
						disabled={!selected || processing || loading}
						loading={processing}
					>
						Restore
					</Button>
				</div>
			</div>
		</Dialog>
	);
}

const renderHiddenPlayerOption: ItemRenderer<HiddenPlayerState> = (player, {handleClick, handleFocus, modifiers}) => {
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

