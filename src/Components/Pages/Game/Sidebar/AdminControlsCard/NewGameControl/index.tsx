import {Button, Classes, Dialog, Intent} from '@blueprintjs/core';
import {Select2 as Select, ItemRenderer} from '@blueprintjs/select';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {useState, useCallback, useEffect} from 'react';
import {Game, GameModel} from '../../../../../../Api/Game-Catalog/Models/Games';
import {GameStartPayload} from '../../../../../../Api/Game-State/Models/Games';
import * as toaster from '../../../../../../Toaster';
import {FrameLoadingSpinner} from '../../../../../FrameLoadingSpinner';
import {Spacing} from '../../../../../../Styles/variables';

interface INewGameProps {
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export const NewGameControl: React.FC<INewGameProps> = ({startNewGame}) => {
	const [showNewGameDialog, setShowNewGameDialog] = useState(false);

	const closeNewGameDialog = useCallback(() => setShowNewGameDialog(false), []);

	const onNewGameClick = useCallback(() => {
		setShowNewGameDialog(true);
	}, []);

	return (
		<>
			<Button
				title="New Game"
				intent={Intent.PRIMARY}
				onClick={onNewGameClick}
			>
				New Game
			</Button>

			{showNewGameDialog &&
				<NewGameDialog
					onClose={closeNewGameDialog}
					onConfirm={startNewGame}
				/>
			}
		</>
	);
};

interface INewGameDialogProps {
	onClose: () => void;
	onConfirm: (payload: GameStartPayload) => Promise<void>;
}

export const NewGameDialog: React.FC<INewGameDialogProps> = ({onClose, onConfirm}) => {
	const [gamesList, setGamesList] = useState<Game[]>([]);
	const [selectedGame, setSelectedGame] = useState<Game | undefined>();
	const [processing, setIsProcessing] = useState(false);
	const [loading, setIsLoading] = useState(true);

	const onClickStartNewGame = useCallback(async () => {
		setIsProcessing(true);

		const gameStartPayload: GameStartPayload = {
			catalog_id: selectedGame?.id!,
		};

		await onConfirm(gameStartPayload);

		setIsProcessing(false);

		onClose();
	}, [selectedGame, processing]);

	useEffect(() => {
		setIsLoading(true);

		GameModel.list()
			.then(response => setGamesList(response.data.filter(game => game.publishedDate !== null)))
			.then(() => setIsLoading(false))
			.catch((_) => {
				toaster.error('Could not obtain available games.');

				onClose();
			});
	}, []);

	return (
		<Dialog isOpen title="Start new game" onClose={onClose}>
			{loading ? (
				<div style={{marginTop: Spacing.l}}>
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

							<Button
								text={selectedGame ? selectedGame.name : 'Select a game'}
								rightIcon="double-caret-vertical"
								placeholder="Select a game"
							/>
						</Select>
					</div>

					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button
								onClick={onClickStartNewGame}
								intent={Intent.PRIMARY}
								loading={processing}
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

const renderGameOption: ItemRenderer<Game> = (game, {handleClick, handleFocus, modifiers}) => {
	if (!modifiers.matchesPredicate)
		return null;

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
	);
};
