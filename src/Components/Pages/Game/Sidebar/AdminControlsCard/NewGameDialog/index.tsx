import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { Select2 as Select, ItemRenderer } from "@blueprintjs/select";
import { MenuItem2 as MenuItem } from "@blueprintjs/popover2";
import { useState, useCallback, useEffect } from 'react';
import { Game, GameModel } from '../../../../../../Api/Game-Catalog/Models/Games';
import { GameStartPayload } from '../../../../../../Api/Game-State/Models/Games';
import * as toaster from '../../../../../../Toaster';
import { FrameLoadingSpinner } from '../../../../../FrameLoadingSpinner';

interface IProps {
	onClose: () => void;
	onConfirm: (gameId: GameStartPayload) => Promise<void>;
}

export const NewGameDialog: React.FC<IProps> = ({ onClose, onConfirm }) => {
	const [gamesList, setGamesList] = useState<Game[]>([]);
	const [selectedGame, setSelectedGame] = useState<Game | undefined>();
	const [processing, setIsProcessing] = useState({ list: true, start: false });

	const onClickStartNewGame = useCallback(async () => {
		setIsProcessing({ list: false, start: true });

		const gameId: GameStartPayload = {
			catalog_id: selectedGame?.id!,
		};

		await onConfirm(gameId);

		setIsProcessing({ list: false, start: false });

		onClose();
	}, [selectedGame]);

	useEffect(() => {
		const loadGamesList = async () => {
			setIsProcessing({ list: true, start: false });

			try {
				await GameModel.list().then(response => setGamesList(response.data));
			} catch (_) {
				toaster.error('Could not obtain available games.');

				onClose();

				return;
			}

			setIsProcessing({ list: false, start: false });
		}

		loadGamesList();
	}, []);

	return (
		<Dialog isOpen title="Start new game" onClose={onClose}>
			{processing.list ? (
				<div style={{ marginTop: '1rem' }}>
					<FrameLoadingSpinner />
				</div>
			) : (
				<>
					<div className={Classes.DIALOG_BODY}>
						<p>Please select a game from the options below:</p>

						<Select<Game>
							items={gamesList}
							onItemSelect={setSelectedGame}
							filterable={false}
							itemRenderer={renderGameOption}
							noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
						>

							<Button text={selectedGame ? selectedGame.name : 'Select a game'} rightIcon="double-caret-vertical" placeholder="Select a game" />
						</Select>
					</div>

					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button
								onClick={onClickStartNewGame}
								intent={Intent.PRIMARY}
								loading={processing.start}
								disabled={!selectedGame}
							>
								Start Game
							</Button>
						</div>
					</div>
				</>
			)}
		</Dialog>
	);
};

const renderGameOption: ItemRenderer<Game> = (game, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate) {
        return null;
    }
	 return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={game.id}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={game.name}
		/>
	 )
}