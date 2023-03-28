import * as React from 'react';
import {Redirect} from 'react-router';
import {Board, BoardModel} from '../../../Api/Game-Catalog/Models/Boards';
import {Stage} from '../../../Api/Game-Catalog/Models/Stages';
import {
	GamesModel,
	GameStartPayload,
	GameState,
	isGameStartError,
	NextBoardResult,
	PlayerCreated,
	PlayerMoved,
	PlayerState,
	UpdateResultType,
} from '../../../Api/Game-State/Models/Games';
import {HistoryItem, HistoryModel} from '../../../Api/Game-State/Models/History';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {replace} from '../../Utility/array';
import {GameAnnouncement} from './Board/GameAnnouncement';
import {GameBoard} from './Board/GameBoard';
import {Sidebar} from './Sidebar';
import {AdminControlsCard} from './Sidebar/AdminControlsCard';
import {LogHistoryCard} from './Sidebar/LogHistoryCard';
import {PlayerStatsCard} from './Sidebar/PlayerStatsCard';
import {TopRankedPlayersCard} from './Sidebar/TopRankedPlayersCard';

export type PlayerAnnouncement = PlayerCreated | PlayerMoved;

export function getPlayerStage(player?: PlayerAnnouncement | null): Stage | null {
	if (player?.type === UpdateResultType.MOVED)
		return player.new_stage.stage;

	else if (player?.type === UpdateResultType.CREATED)
		return player.initial_stage?.stage;

	return null;
}

export function getPlayerPoints(player?: PlayerAnnouncement | null): number {
	if (player?.type === UpdateResultType.MOVED)
		return player.new_point_total;

	else if (player?.type === UpdateResultType.CREATED)
		return player.player.current_points;

	return 0;
}

interface IState {
	board: Board | null;
	gameState: GameState | null;
	history: HistoryItem[] | null;
	loadingHistory: boolean;
	playerAnnouncements: PlayerAnnouncement[];
	movingPlayer: PlayerAnnouncement | null;
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
		playerAnnouncements: [],
		history: [],
		loadingHistory: false,
		movingPlayer: null,
		currentPlayer: null,
		loading: true,
		redirect: false,
		processing: false,
	};

	public async componentDidMount() {
		await this.fetchGameState(true);
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

					<GameAnnouncement playerAnnouncement={this.state.movingPlayer} />
				</div>

				<div>
					<Sidebar
						processing={this.state.processing}
						buttonLabel={this.state.playerAnnouncements.length === 0 ? 'Start' : 'Next'}
						onButtonClick={(
							this.state.playerAnnouncements.length === 0
								? this.onStartPlayerUpdateClick
								: this.onNextPlayerClick
						)}
					>
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
		let result;

		try {
			result = await GamesModel.nextBoard(this.state.gameState!.account_id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			return;
		}

		if (result.status === NextBoardResult.Success) {
			try {
				await this.fetchGameState(false);
			} catch (_) {
				toaster.showUnhandledErrorMessage();

				return;
			}
		}

		if (result)
			toaster.notifyNextBoardResult(result.status);
		else
			toaster.showUnhandledErrorMessage();
	}

	public startNewGame = async (payload: GameStartPayload) => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true
		});

		try {
			await GamesModel.deleteGameState(this.context!.account.id);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

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

	private onStartPlayerUpdateClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		let playerAnnouncements: PlayerAnnouncement[];

		try {
			playerAnnouncements = await GamesModel.update(this.context!.account.id).then(
				response => response.data.filter(player =>
					player.type === UpdateResultType.CREATED || player.type === UpdateResultType.MOVED
				) as PlayerAnnouncement[]
			);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		if (playerAnnouncements.length > 0)
			toaster.success('Game is ready to play!');
		else if (playerAnnouncements.length === 0)
			toaster.success('All players are moved.')

		this.setState({
			playerAnnouncements: playerAnnouncements.sort((a , b) => getPlayerPoints(b) - getPlayerPoints(a)),
			processing: false,
		});
	};

	private onNextPlayerClick = () => {
		let movingPlayer = this.state.playerAnnouncements.pop() ?? null;

		if (!movingPlayer) {
			toaster.success('All players are moved.');

			return;
		}

		const movingPlayerStage = getPlayerStage(movingPlayer);

		if (!movingPlayerStage) {
			toaster.error('Could not find Player\'s stage');

			return;
		}

		let players = this.state.gameState!.players;

		let newPlayerState : PlayerState = {
			hub_id: movingPlayer.player.hub_id,
			user_name: movingPlayer.player.user_name,
			current_points: getPlayerPoints(movingPlayer),
			current_stage_name: movingPlayerStage.name,
			current_stage_id: movingPlayerStage.id,
		}

		let currentPlayerState = players.find(player => player.hub_id === movingPlayer!.player.hub_id);

		if (currentPlayerState)
			players = replace(players, currentPlayerState, newPlayerState);
		else
			players = [...players, newPlayerState];

		this.setState(state => ({
			movingPlayer,
			history: state.history ? [...state.history, movingPlayer!.history_item] : [movingPlayer!.history_item],
			gameState: {
				...state.gameState!,
				players,
			},
		}));
	};
}
