import { Button, Classes, Dialog, Intent, HTMLSelect } from '@blueprintjs/core';
import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { Game, GameModel } from '../../../../../../Api/Game-Catalog/Models/Games';
import { GameStartPayload } from '../../../../../../Api/Game-State/Models/Games';
import * as toaster from '../../../../../../Toaster';
import { FrameLoadingSpinner } from '../../../../../FrameLoadingSpinner';

interface IProps {
	onClose: () => void;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export const NewGameDialog: React.FC<IProps> = ({ onClose, startNewGame }) => {
	const [gamesList, setGamesList] = useState<Game[]>([]);

	const [selectedGameId, setSelectedGameId] = useState<number>();

	const [processing, setIsProcessing] = useState({ list: true, start: false });

	const onChangeGame = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => setSelectedGameId(parseInt(e.currentTarget.value)),
		[],
	);

	const loadGamesList = useCallback(async () => {
		setIsProcessing({ list: true, start: false });

		try {
			await GameModel.list().then(response => setGamesList(response.data));
		} catch (_) {
			toaster.error('Caught an error while fetching available games.');

			onClose();

			return;
		}

		setIsProcessing({ list: false, start: false });
	}, []);

	const onClickStartNewGame = useCallback(async () => {
		setIsProcessing({ list: false, start: true });

		const gameId: GameStartPayload = {
			catalog_id: selectedGameId!,
		};

		await startNewGame(gameId);

		setIsProcessing({ list: false, start: false });

		onClose();
	}, [selectedGameId]);

	useEffect(() => {
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

						<HTMLSelect value={selectedGameId} onChange={onChangeGame} fill>
							{/* react complains about it, but bpjs suggests using this way */}
							{/* defaultValue seems to not work */}
							<option selected hidden>
								Choose a game:
							</option>

							{gamesList?.map(game => (
								<option key={game.id} value={game.id}>
									{game.name}
								</option>
							))}
						</HTMLSelect>
					</div>

					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button
								onClick={onClickStartNewGame}
								intent={Intent.PRIMARY}
								loading={processing.start}
								disabled={!selectedGameId}
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