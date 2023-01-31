import * as React from 'react';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { Game, GameModel } from '../../../Api/Game-Catalog/Models/Games';
import * as toaster from '../../../Toaster';
import { Button } from '@blueprintjs/core';
import { NonIdealState } from '../../NonIdealState';
import { GameInfoCard } from './GameInfoCard';

const ITEMS_PER_PAGE = 8;

interface IState {
	loading: boolean;
	games: Game[];
	currentPage: number;
	totalPages: number;
}

export class CatalogListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		currentPage: 1,
		totalPages: 0,
		games: [],
	};

	public async componentDidMount() {
		await this.fetchCatalogData();
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;
		if (this.state.games.length <= 0) {
			return (
				<NonIdealState
					title="Error"
					action={<Button onClick={this.fetchCatalogData}>Try again</Button>}
					description="No games found"
				/>
			);
		}

		const { currentPage, totalPages } = this.state;
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currrentPageItems = this.state.games.slice(startIndex, endIndex);

		return (
			<div style={{ display: 'flex', flexDirection: 'column', width: '75vw', margin: '0 auto' }}>
				<h1>Game Catalog</h1>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
					{currrentPageItems.map(game => (
						<GameInfoCard game={game} key={game.id}/>
					))}
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '2rem',
						width: '100%',
						gap: '2rem',
					}}
				>
					<Button
						disabled={this.state.currentPage === 1}
						onClick={this.onClickBack}
						icon="caret-left"
					>
						Prev
					</Button>

					<span>
						{currentPage}/{totalPages}
					</span>

					<Button
						disabled={this.state.currentPage >= totalPages}
						onClick={this.onClickNext}
						rightIcon="caret-right"
					>
						Next
					</Button>
				</div>
			</div>
		);
	}

	private onClickNext = () => {
		if (this.state.currentPage === this.state.totalPages)
			return;

		this.setState(state => ({
			currentPage: state.currentPage + 1
		}));
	};

	private onClickBack = () => {
		if (this.state.currentPage === 1)
			return;

		this.setState(state => ({
			currentPage: state.currentPage - 1
		}));
	};

	private fetchCatalogData = async () => {
		if (this.state.loading)
			return;

		let games: Game[];

		this.setState({
			loading: true
		});

		try {
			games = await GameModel.list().then(response => response.data);
		} catch {
			toaster.showUnhandledErrorMessage();

			this.setState({
				games: [],
				loading: false,
			});

			return;
		}

		const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);

		this.setState({
			games,
			totalPages,
			loading: false,
		});
	};
}
