import { GameStartPayload } from '../../../../../Api/Game-State/Models/Games';
import { GameCard } from '../GameCard/GameCard';
import { Board } from '../../../../../Api/Game-Catalog/Models/Boards';
import { ConfirmNextBoardControl } from './ConfirmNextBoardControl';
import { NewGameControl } from './NewGameControl';
import { UpdatePreviewControl } from './UpdatePreviewControl';
import './AdminControlsCard.scss';

interface IProps {
	board: Board;
	goToNextBoard: () => Promise<void>;
	startNewGame: (gameId: GameStartPayload) => Promise<void>;
}

export const AdminControlsCard: React.FC<IProps> = ({ board, goToNextBoard, startNewGame }) => (
	<GameCard title="Admin Controls" icon="control">
		<div className="admin-controls-container">
			<UpdatePreviewControl
				board={board}
			/>

			<ConfirmNextBoardControl
				goToNextBoard={goToNextBoard}
			/>

			<NewGameControl
				startNewGame={startNewGame}
			/>
		</div>
	</GameCard>
);
