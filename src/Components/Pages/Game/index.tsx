import * as React from 'react';
import { Redirect } from 'react-router';
import { Board, BoardModel } from '../../../Api/Game-Catalog/Models/Boards';
import {
	GameNotFoundResponse,
	GamesModel,
	GameStartPayload,
	GameState,
	PlayerState,
	NextBoardResult,
	isGameStartError,
	UpdateResultType, PlayerUpdate,
} from '../../../Api/Game-State/Models/Games';
import { HistoryItem, HistoryModel } from '../../../Api/Game-State/Models/History';
import { UserContext } from '../../../Session';
import * as toaster from '../../../Toaster';
import { LogHistoryCard } from './Sidebar/LogHistoryCard';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { GameAnnouncement } from './Board/GameAnnouncement';
import { GameBoard } from './Board/GameBoard';
import { Sidebar } from './Sidebar';
import { PlayerStatsCard } from './Sidebar/PlayerStatsCard';
import { TopRankedPlayersCard } from './Sidebar/TopRankedPlayersCard';
import { AdminControlsCard } from './Sidebar/AdminControlsCard';


interface IState {
	board: Board | null;
	gameState: GameState | null;
	history: HistoryItem[] | null;
	loadingHistory: boolean;
	playerUpdates: PlayerUpdate[];
	movingPlayer: PlayerUpdate | null;
	currentPlayer: PlayerState | null;
	loading: boolean;
	redirect: boolean;
	processing: boolean;
}

export class GameBoardPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		board: null,
		gameState: null,
		playerUpdates: [],
		history: [],
		loadingHistory: false,
		movingPlayer: null,
		currentPlayer: null,
		loading: true,
		redirect: false,
		processing: false,
	};

	public async componentDidMount() {
		this.fetchGameState(true);
	}

	public render() {
		if (this.state.redirect)
			return <Redirect to="/" />;
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div style={{display: 'grid', gridTemplateColumns: '5fr 2fr'}}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<GameBoard board={this.state.board!} gameState={this.state.gameState!} />

					{/*TODO: When the movement control code sets a new movingPlayer, the fade animation will reset*/}
					<GameAnnouncement player={this.state.movingPlayer} stage={this.getMovingPlayerStage()} />
				</div>
				<div>
					<Sidebar>
						{/*TODO: implement sidebar game cards*/}
						<LogHistoryCard
							processing={this.state.loadingHistory}
							history={this.state.history}
							refresh={this.loadHistory}
							loadMore={this.loadMoreHistory}
						/>

						<TopRankedPlayersCard players={this.state.gameState!.players} />

						<PlayerStatsCard player={this.state.currentPlayer} />

						<AdminControlsCard
							board={this.state.board!}
							goToNextBoard={this.goToNextBoard}
							startNewGame={this.startNewGame}
						/>

						<LogHistoryCard
							processing={this.state.loadingHistory}
							history={this.state.history}
							refresh={this.loadHistory}
							loadMore={this.loadMoreHistory}
						/>
					</Sidebar>
				</div>
			</div>
		);
	}

	private async fetchHistory() {
		try {
			return await HistoryModel.get(this.context!.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			return null;
		}
	}

	private loadHistory = async () => {
		this.setState({ loadingHistory: true });

		const history = await this.fetchHistory();

		this.setState({ history, loadingHistory: false });
	};

	private loadMoreHistory = async () => {
		let items: HistoryItem[] = [];

		this.setState({
			loadingHistory: true,
		});

		try {
			items = await HistoryModel.getAfter(this.context!.id, this.state.history!.at(-1)!.id).then(
				response => response.data,
			);

			this.setState(({ history }) => {
				if (history !== null)
					return { history: [...history, ...items], loadingHistory: false };
				else
					return { history: items, loadingHistory: false };
			});
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				loadingHistory: false
			});
		}
	};


	private getCurrentPlayer(players: PlayerState[]): PlayerState | null {
		return players.find(player => player.hub_id === this.context!.id) || null;
	}

	private fetchGameState = async (redirect: boolean) => {
		this.setState({
			loading: true,
		});

		let gameState: GameState;

		try {
			gameState = await GamesModel.gameInfo(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			if (redirect)
				this.setState({ redirect: true });

			return;
		}

		let board: Board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			if (redirect)
				this.setState({ redirect: true });

			return;
		}

		const history = await this.fetchHistory();

		const currentPlayer = this.getCurrentPlayer(gameState.players);


		this.setState({
			board,
			gameState,
			history,
			currentPlayer,
			loading: false,
		});
	}

	public goToNextBoard = async () => {
		let result: NextBoardResult;

		try {
			result = await GamesModel.nextBoard(this.state.gameState!.account_id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			return;
		}

		if (result === NextBoardResult.Success) {
			try {
				await this.fetchGameState(false);
			} catch (_) {
				toaster.showUnhandledErrorMessage();

				return;
			}
		}

		toaster.notifyNextBoardResult(result);
	}

	public startNewGame = async (payload: GameStartPayload) => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true
		});

		let gameState;

		try {
			gameState = await GamesModel.startGame(this.context!.account.id, payload).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				loading: false
			});

			return;
		}

		if (isGameStartError(gameState)) {
			toaster.info('Game not found');

			this.setState({
				loading: false
			});

			return;
		}

		let board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				loading: false
			});

			return;
		}

		this.setState({
			board,
			gameState,
			loading: false,
		});
	}

	// TODO: Called when Sidebar "Start" button is clicked to load all the updated players
	private onStartPlayerUpdateClick = async () => {
		// TODO: This processing bool should be passed to the Sidebar "Start" button to disable clicking it again
		this.setState({
			processing: true,
		});

		let playerUpdates: PlayerUpdate[] = [];

		try {
			playerUpdates = await GamesModel.update(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		toaster.success('Game is ready to play!');

		this.setState({
			playerUpdates: playerUpdates.filter(player =>
				player.type === UpdateResultType.CREATED || player.type === UpdateResultType.MOVED
			),
			processing: false,
		});
	};

	// TODO: Called from Sidebar "Next" button
	private onNextPlayerClick = () => {
		let nextPlayerIndex = 0;

		if (this.state.movingPlayer)
			nextPlayerIndex = this.state.playerUpdates.indexOf(this.state.movingPlayer) + 1;

		let movingPlayer = this.state.playerUpdates[nextPlayerIndex];

		this.setState({
			movingPlayer,
		});

		if (movingPlayer.type === UpdateResultType.CREATED || movingPlayer.type === UpdateResultType.MOVED) {
			const historyItem = movingPlayer.history_item;

			this.setState(state => ({
				history: state.history ? [...state.history, historyItem] : [historyItem],
			}));
		}
	};

	private getMovingPlayerStage = () => {
		if (this.state.movingPlayer && this.state.movingPlayer.type !== UpdateResultType.DELETED)
			return this.state.board!.stages[this.state.movingPlayer.player.current_stage_index];

		return null;
	};
}
