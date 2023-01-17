import * as React from 'react';
import { Redirect } from 'react-router';
import { Board, BoardModel } from '../../../Api/Game-Catalog/Models/Boards';
import { GameNotFoundResponse, GamesModel, GameStartPayload, GameState, PlayerState } from '../../../Api/Game-State/Models/Games';
import { HistoryItem, HistoryModel } from '../../../Api/Game-State/Models/History';
import { UserContext } from '../../../Session';
import * as toaster from '../../../Toaster';
import { LogHistoryCard } from './Sidebar/LogHistoryCard';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { GameAnnouncement } from './Board/GameAnnouncement';
import { GameBoard } from './Board/GameBoard';
import { Sidebar } from './Sidebar';

interface IState {
	board: Board | null;
	gameState: GameState | null;
	history: HistoryItem[] | null;
	loadingHistory: boolean;
	movingPlayer: PlayerState | null;
	loading: boolean;
	redirect: boolean;
}

export class GameBoardPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		board: null,
		gameState: null,
		history: [],
		loadingHistory: false,
		movingPlayer: null,
		loading: true,
		redirect: false,
	};

	public async componentDidMount() {
		let gameState: GameState;

		try {
			gameState = await GamesModel.gameInfo(this.context!.account.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		let board: Board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({
				redirect: true,
			});

			return;
		}

		const history = await this.fetchHistory();

		this.setState({
			board,
			gameState,
			history,
			loading: false,
		});
	}

	public render() {
		if (this.state.redirect)
			return <Redirect to="/" />;
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr' }}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<GameBoard board={this.state.board!} gameState={this.state.gameState!} />

					{/*TODO: When the movement control code sets a new movingPlayer, the fade animation will reset*/}
					<GameAnnouncement player={this.state.movingPlayer} />
				</div>

				<Sidebar>
					{/*TODO: implement sidebar game cards*/}

					<LogHistoryCard
						processing={this.state.loadingHistory}
						history={this.state.history}
						refresh={this.loadHistory}
						loadMore={this.loadMoreHistory}
					/>
				</Sidebar>
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

			this.setState({ loadingHistory: false });
		}
	};

	public startNewGame = async (gameId: GameStartPayload) => {
		this.setState({ loading: true });

		let gameState: GameState | GameNotFoundResponse;

		const hasGameStartError = (response: GameState | GameNotFoundResponse): response is GameNotFoundResponse => (response as GameNotFoundResponse).error !== undefined;

		try {
			gameState = await GamesModel.startGame(this.context!.account.id, gameId).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({ loading: false });

			return;
		}

		if (hasGameStartError(gameState)) {
			toaster.info('Game not found');

			this.setState({ loading: false });

			return;
		}

		let board: Board;

		try {
			board = await BoardModel.read(gameState.current_board.id).then(response => response.data);
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({ loading: false });

			return;
		}

		this.setState({
			board,
			gameState,
			loading: false,
		});
	}
}
