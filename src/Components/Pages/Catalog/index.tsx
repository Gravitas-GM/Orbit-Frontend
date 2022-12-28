import * as React from 'react';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { Game, GameModel } from '../../../Api/Game-Catalog/Models/Games';
import * as toaster from '../../../Toaster';
import { Button, Card } from '@blueprintjs/core';
import { NonIdealState } from '../../NonIdealState';
const ITEMS_PER_PAGE = 8;

interface IState {
	loading: boolean;
	games: Game[] | null;
	currentPage: number;
	totalPages: number;
}

export class CatalogListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
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
		if (!this.state.games) {
			return (
				<NonIdealState
					title="Error"
					action={<Button onClick={this.fetchCatalogData}>Try again</Button>}
					description="There was an error while fetching catalog data"
				/>
			);
		}

		const { currentPage, totalPages } = this.state;
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currrentPageItems = this.state.games.slice(startIndex, endIndex);

		return (
			<div style={{ display: 'flex', padding: '0  2rem', flexDirection: 'column' }}>
				<h1>Game Catalog</h1>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', width: '100%' }}>
					{/*  please, dont consider this part, since it will become the game card */}
					{currrentPageItems.map(game => (
						<Card key={game.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<figure>
									<img src={game.thumbnailUrl!} alt={game.name} width="180" />
								</figure>

								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<h2>{game.name}</h2>

									<span>Game Description</span>

									<div>
										<h3>Boards</h3>

										<div style={{ display: 'flex', gap: '0.75rem' }}>
											{game.boards.map(board => (
												<span key={board.id}>{board.name}</span>
											))}
										</div>
									</div>
								</div>
							</div>

							<Button>Play Game</Button>
						</Card>
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

		this.setState(state => ({ currentPage: state.currentPage + 1 }));
	};

	private onClickBack = () => {
		if (this.state.currentPage === 1)
			return;

		this.setState(state => ({ currentPage: state.currentPage - 1 }));
	};

	private fetchCatalogData = async () => {
		let games: Game[];
		let totalPages: number;

		this.setState({ loading: true });

		try {
			games = await GameModel.list().then(response => response.data);
		} catch {
			toaster.showUnhandledErrorMessage();

			this.setState({
				games: null,
				loading: false,
			});

			return;
		}

		totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);

		this.setState({
			games,
			totalPages,
			loading: false,
		});
	};
}
