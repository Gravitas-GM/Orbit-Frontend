import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { useState, useCallback, useEffect } from 'react';
import { Game, GameModel } from '../../../../../../Api/Game-Catalog/Models/Games';
import * as toaster from '../../../../../../Toaster';

interface IProps {
	onClose: () => void;
}

export const NewGameDialog: React.FC<IProps> = ({ onClose }) => {
	const [gamesList, setGamesList] = useState<Game[]>([]);

	const [selectedGame, setSelectedGame] = useState<Game | null>(null);

	const [processing, setIsProcessing] = useState({ list: false, start: false });

	const loadGamesList = useCallback(async () => {
		setIsProcessing({ list: true, start: false });

		try {
			await GameModel.list().then(response => setGamesList(response.data));
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		setIsProcessing({ list: false, start: false });
	}, []);

	const startGame = useCallback(async () => {
		setIsProcessing({ list: false, start: true });

		try {
			await GameModel.list().then(response => setGamesList(response.data));
		} catch (_) {
			toaster.showUnhandledErrorMessage();
		}

		setIsProcessing({ list: false, start: false });
	}, []);

	useEffect(() => {
		loadGamesList();
	}, []);

	return (
		<Dialog isOpen title="New Game" onClose={onClose}>
			<div className={Classes.DIALOG_BODY}>
				<p>Please select a game from the options below:</p>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button onClick={startGame} intent={Intent.PRIMARY} loading={processing.start}>
						Start Game
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
