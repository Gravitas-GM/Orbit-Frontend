import * as React from 'react';
import {Navigate} from 'react-router-dom';
import {isNotFoundError} from '../../../Api/errors';
import {ApiError} from '../../../Api/errors/rocket';
import {Board, BoardModel} from '../../../Api/Game-Catalog/Models/Boards';
import {Stage} from '../../../Api/Game-Catalog/Models/Stages';
import {
	GamesModel,
	GameStartPayload,
	GameState,
	getNewPointsFromPlayerUpdate,
	isGameStartError,
	NextBoardResult,
	PlayerCreated,
	PlayerMoved,
	PlayerState,
	UpdateResultType,
} from '../../../Api/Game-State/Models/Games';
import {HistoryItem, HistoryModel} from '../../../Api/Game-State/Models/History';
import {Permission} from '../../../Api/permissions';
import {FrameLoadingSpinner} from '../../../Components/FrameLoadingSpinner';
import {IsGranted} from '../../../Components/Security/IsGranted';
import {SessionContext} from '../../../contexts/SessionContext';
import {toaster} from '../../../toaster';
import {replace} from '../../../utility/array';
import {PlayArea} from './PlayArea';
import {GameAnnouncement} from './PlayArea/GameAnnouncement';
import {Sidebar} from './Sidebar';
import {AdminControlsCard} from './Sidebar/AdminControlsCard';
import {LogHistoryCard} from './Sidebar/LogHistoryCard';
import {PlayerStatsCard} from './Sidebar/PlayerStatsCard';
import {TopRankedPlayersCard} from './Sidebar/TopRankedPlayersCard';

export type PlayerAnnouncement = PlayerCreated | PlayerMoved;

export function getPlayerStage(player: PlayerAnnouncement): Stage {
	switch (player.type) {
		case UpdateResultType.MOVED:
			return player.new_stage.stage;

		case UpdateResultType.CREATED:
			return player.initial_stage.stage;
	}
}

interface State {
	board: Board | null;
	gameState: GameState | null;
	history: HistoryItem[] | null;
	loadingHistory: boolean;
	playerAnnouncements: PlayerMovementSet;
	movingPlayer: PlayerAnnouncement | null;
	currentPlayer: PlayerState | null;
	loading: boolean;
	redirect: boolean;
	processing: boolean;
	disablePlayButton: boolean;
}

export class GameBoard extends React.PureComponent<{}, State> {
	public static contextType = SessionContext;
	declare context: React.ContextType<typeof SessionContext>;

	public state: Readonly<State> = {
		board: null,
		gameState: null,
		playerAnnouncements: PlayerMovementSet.empty(),
		history: [],
		loadingHistory: false,
		movingPlayer: null,
		currentPlayer: null,
		loading: true,
		redirect: false,
		processing: false,
		disablePlayButton: false,
	};

	public async componentDidMount() {
		await this.fetchGameState(true);
	}

	public render() {
		if (this.state.redirect)
			return <Navigate to="/" />;
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '10fr 2fr',
				}}
			>
				<div
					style={{
						display: 'flex',
						position: 'relative',
						width: '100%',
					}}
				>
					<PlayArea board={this.state.board!} gameState={this.state.gameState!} />

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: 'inherit',
							position: 'absolute',
						}}
					>
						<GameAnnouncement player={this.state.movingPlayer} />
					</div>
				</div>

				<div>
					<Sidebar
						processing={this.state.processing}
						disabled={this.state.disablePlayButton}
						buttonLabel={this.state.playerAnnouncements.isEmpty() ? 'Start' : 'Next'}
						onButtonClick={(
							this.state.playerAnnouncements.isEmpty()
								? this.onStartPlayerUpdateClick
								: this.onNextPlayerClick
						)}
					>
						<LogHistoryCard
							processing={this.state.loadingHistory}
							history={this.state.history}
							onLoadClick={this.loadHistory}
						/>

						<TopRankedPlayersCard players={this.state.gameState!.players} />

						<PlayerStatsCard player={this.state.currentPlayer} />

						<IsGranted match={Permission.Admin}>
							<AdminControlsCard
								board={this.state.board!}
								goToNextBoard={this.goToNextBoard}
								startNewGame={this.startNewGame}
							/>
						</IsGranted>
					</Sidebar>
				</div>
			</div>
		);
	}

	private loadHistory = async () => {
		if (this.state.loadingHistory)
			return;

		this.setState({
			loadingHistory: true,
		});

		const items = await this.fetchNextHistory();

		if (items === null || items.length === 0) {
			this.setState({
				loadingHistory: false,
			});

			return;
		}

		this.setState(({history}) => ({
			loadingHistory: false,
			history: [...(history ?? []), ...items],
		}));
	};

	private async fetchNextHistory() {
		const accountId = this.context!.user.account.id;

		try {
			if (this.state.history && this.state.history.length > 0) {
				const lastItem = this.state.history.at(-1)!;
				return await HistoryModel.getBefore(accountId, lastItem.id).then(r => r.data);
			} else
				return await HistoryModel.get(accountId).then(r => r.data);
		} catch (error) {
			if (!isNotFoundError(error))
				toaster.showUnhandledErrorMessage();

			return null;
		}
	}

	private getCurrentPlayer(players: PlayerState[]): PlayerState | null {
		return players.find(player => player.hub_id === this.context!.user.id) || null;
	}

	private fetchGameState = async (redirect: boolean) => {
		this.setState({
			loading: true,
		});

		let gameState: GameState;

		try {
			gameState = await GamesModel.gameInfo(this.context!.user.account.id).then(r => r.data);
		} catch (error) {
			if (error instanceof ApiError && error.isNotFound())
				toaster.warning('There are currently no active games for your account.');
			else
				toaster.showUnhandledErrorMessage();

			if (redirect)
				this.setState({redirect: true});

			return;
		}

		let board: Board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(r => r.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			if (redirect)
				this.setState({redirect: true});

			return;
		}

		const history = await this.fetchNextHistory();

		const currentPlayer = this.getCurrentPlayer(gameState.players);

		this.setState({
			board: {
				...board,
				stages: board.stages.sort((a, b) => a.requiredPoints - b.requiredPoints),
			},
			gameState,
			history,
			currentPlayer,
			loading: false,
		});
	};

	private goToNextBoard = async () => {
		let result;

		try {
			result = await GamesModel.nextBoard(this.state.gameState!.account_id);
		} catch (error) {
			if (error instanceof ApiError && error.isNotFound())
				toaster.warning('There are currently no active games for your account.');
			else
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
	};

	private startNewGame = async (payload: GameStartPayload) => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		try {
			await GamesModel.deleteGameState(this.context!.user.account.id);
		} catch (error) {
			if (error instanceof ApiError && error.isNotFound())
				toaster.warning('There are currently no active games for your account.');
			else
				toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		let gameState;

		try {
			gameState = await GamesModel.startGame(this.context!.user.account.id, payload).then(
				async () => await GamesModel.gameInfo(this.context!.user.account.id).then(r => r.data),
			);
		} catch (error) {
			if (error instanceof ApiError && error.isNotFound())
				toaster.warning('Could not find specified game to start.');
			else
				toaster.showUnhandledErrorMessage();

			this.setState({
				loading: false,
			});

			return;
		}

		if (isGameStartError(gameState)) {
			toaster.info('Game not found');

			this.setState({
				loading: false,
			});

			return;
		}

		let board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(response => response.data);
		} catch (e) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				loading: false,
			});

			return;
		}

		toaster.success('New game started successfully');

		this.setState({
			board,
			gameState,
			loading: false,
		});
	};

	private onStartPlayerUpdateClick = async () => {
		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		let playerAnnouncements: PlayerAnnouncement[];

		try {
			playerAnnouncements = await GamesModel.update(this.context!.user.account.id).then(
				response => response.data.filter(player =>
					player.type === UpdateResultType.CREATED || player.type === UpdateResultType.MOVED,
				) as PlayerAnnouncement[],
			);
		} catch (error) {
			if (error instanceof ApiError && error.isNotFound())
				toaster.warning('There are currently no active games for your account.');
			else
				toaster.showUnhandledErrorMessage();

			this.setState({
				processing: false,
			});

			return;
		}

		if (playerAnnouncements.length > 0)
			toaster.success('Game is ready to play!');
		else if (playerAnnouncements.length === 0)
			toaster.success('All players are moved.');

		this.setState({
			playerAnnouncements: new PlayerMovementSet(playerAnnouncements),
			processing: false,
		});
	};

	private onNextPlayerClick = () => {
		let movingPlayer = this.state.playerAnnouncements.next();

		if (!movingPlayer)
			return;

		const movingPlayerStage = getPlayerStage(movingPlayer);

		if (!movingPlayerStage) {
			toaster.error('Could not find player\'s stage');

			return;
		}

		let players = this.state.gameState!.players;

		let newPlayerState: PlayerState = {
			hub_id: movingPlayer.player.hub_id,
			user_name: movingPlayer.player.user_name,
			current_points: getNewPointsFromPlayerUpdate(movingPlayer),
			current_stage_name: movingPlayerStage.name,
			current_stage_id: movingPlayerStage.id,
		};

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

		if (this.state.playerAnnouncements.isEmpty()) {
			this.setState({
				disablePlayButton: true,
			});

			toaster.success('All players have been moved.');

			setTimeout(() => {
				this.setState({
					disablePlayButton: false,
				});
			}, 5000);
		}
	};
}

class PlayerMovementSet {
	protected static readonly EMPTY = new PlayerMovementSet([]);

	protected readonly players: PlayerAnnouncement[];

	public constructor(players: PlayerAnnouncement[]) {
		// Initially sort player movement by points in descending order. That way, when we `Array.pop()` announcements
		// out of the array during play, we'll get the announcement with the lowest point value first.
		this.players = [...players].sort((a, b) => {
			const aPoints = getNewPointsFromPlayerUpdate(a);
			const bPoints = getNewPointsFromPlayerUpdate(b);

			return bPoints - aPoints;
		});
	}

	public static empty(): PlayerMovementSet {
		return PlayerMovementSet.EMPTY;
	}

	public next(): PlayerAnnouncement | null {
		return this.players.pop() ?? null;
	}

	public isEmpty(): boolean {
		return this.players.length === 0;
	}
}
