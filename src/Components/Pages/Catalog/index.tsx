import * as React from 'react';
import { FrameLoadingSpinner } from '../../FrameLoadingSpinner';
import { Game, GameModel } from '../../../Api/Game-Catalog/Models/Games';
import * as toaster from '../../../Toaster';
import { Button, InputGroup } from '@blueprintjs/core';
import { NonIdealState } from '../../NonIdealState';
import { GameInfoCard } from './GameInfoCard';

const ITEMS_PER_PAGE = 8;

interface IState {
	loading: boolean;
	filteredGames: Game[];
	games: Game[];
	currentPage: number;
	totalPages: number;
}

export class CatalogListPage extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		currentPage: 1,
		totalPages: 0,
		games: [],
		filteredGames: [],
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
		const currrentPageItems = this.state.filteredGames.slice(startIndex, endIndex);

		return (
			<div style={{ display: 'flex', padding: '0  2rem', flexDirection: 'column', height: '100%' }}>
				<header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
					<h1>Game Catalog</h1>

        			<InputGroup
						type="search"
						leftIcon="search"
						placeholder="Search catalog"
						onChange={this.onSearchChange}
					/>
				</header>


				<RenderPageItems items={currrentPageItems} />

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
					<Button disabled={this.state.currentPage === 1} onClick={this.onClickBack} icon="caret-left">
						Prev
					</Button>

					<span>
						{currentPage}
						{totalPages > 0 && `/${totalPages}`}
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
			filteredGames: games,
			totalPages,
			loading: false,
		});
	};

	private onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.value === '') {
			const totalPages = Math.ceil(this.state.games.length / ITEMS_PER_PAGE);

			this.setState({
				filteredGames: this.state.games,
				currentPage: 1,
				totalPages,
			});

			return;
		}

		const filteredGames = this.state.games.filter(game =>
			game.name.toLocaleLowerCase().includes(event.currentTarget.value.toLocaleLowerCase())
		);

		const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

		this.setState({
			filteredGames,
			currentPage: 1,
			totalPages,
		});
	};
}

const RenderPageItems: React.FC<{items: Game[]}> = ({items}) => {
	if (items.length === 0)
		return <NonIdealState title="No results" />;

	return (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', width: '100%' }}>
			{items.map(game => (
				<GameInfoCard game={game} key={game.id} />
			))}
		</div>
	);
};
