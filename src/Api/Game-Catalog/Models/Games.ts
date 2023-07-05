import {gameCatalogClient, Id} from '../..';
import {Board} from './Boards';

export interface GameEndpoints {
	'/games': {
		GET: {
			response: Game[];
		};
	};

	'/games/:id': {
		GET: {
			params: Id;
			response: Game;
		};
	};
}

export interface Game {
	id: number;
	name: string;
	description: string;
	publishedDate: Date | null;
	hidden: boolean;
	boards: Board[];
	thumbnailUrl: string | null;
}

export class GameModel {
	public static list() {
		return gameCatalogClient.get('/games');
	}

	public static read(game: Id) {
		return gameCatalogClient.get<'/games/:id'>(`/games/${game}`);
	}
}
