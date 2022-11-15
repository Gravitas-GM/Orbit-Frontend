import {H1} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect} from 'react-router';
import {Board, BoardModel} from '../../../Api/Game-Catalog/Models/Boards';
import {GamesModel, GameState} from '../../../Api/Game-State/Models/Games';
import {HistoryItem, HistoryModel} from '../../../Api/Game-State/Models/History';
import {UserContext} from '../../../Session';
import * as toaster from '../../../Toaster';
import {FrameLoadingSpinner} from '../../FrameLoadingSpinner';
import {Sidebar} from './Sidebar';
import {LogHistoryCard} from './Sidebar/LogHistoryCard';

interface IState {
	board: Board | null;
	gameState: GameState | null;
	history: HistoryItem[] | null;
	loadingHistory: boolean;
	loading: boolean;
	redirect: boolean;
}

export class GameBoardPage extends React.PureComponent<{}, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		board: null,
		gameState: null,
		history:  [],
		loadingHistory: false,
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
			<div style={{display: 'grid', gridTemplateColumns: '5fr 2fr'}}>
				<H1>Game Board</H1>

				<Sidebar>
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
		this.setState({loadingHistory: true});

		const history = await this.fetchHistory();

		this.setState({history, loadingHistory: false});
	}

	private loadMoreHistory = async () => {
		let items: HistoryItem[] = [];

		this.setState({
			loadingHistory: true
		});

		try {
			items = await HistoryModel.getAfter(this.context!.id, this.state.history!.at(-1)!.id).then(response => response.data);

			this.setState(({history}) => {
				if (history !== null)
					return { history: [...history, ...items], loadingHistory: false };
				else
					return { history: items, loadingHistory: false };
			});
		} catch (_) {
			toaster.showUnhandledErrorMessage();

			this.setState({ loadingHistory: false });
		}
	}
}
