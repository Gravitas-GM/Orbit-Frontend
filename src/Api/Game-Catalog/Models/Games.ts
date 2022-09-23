import {gameCatalogClient, Id, Projectable, Projection, Queryable, QueryDocument} from '../..';
import {Board} from './Boards';

export interface GameEndpoints {
	'/games': {
		GET: {
			query: Queryable & Projectable;
			response: Game[];
		};

		PUT: {
			query: Projectable;
			body: GameCreatePayload;
			response: Game;
		};
	};

	'/games/:id': {
		GET: {
			params: Id;
			response: Game;
		};

		PATCH: {
			params: Id;
			body: GameUpdatePayload;
			response: Game;
		};

		DELETE: {
			params: Id;
			response: void;
		}
	};
}

export interface Game {
	id: number;
	name: string;
	publishedDate: Date | null;
	hidden: boolean;
	boards: Board[];
}

export type GameCreatePayload = Omit<Game, 'id' | 'boards'>;

export type GameUpdatePayload = Partial<Omit<Game, 'id' | 'boards'>>;

export class GameModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return gameCatalogClient.get('/games', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: GameCreatePayload, projection?: Projection) {
		return gameCatalogClient.put('/games', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(game: Id) {
		return gameCatalogClient.get<'/games/:id'>(`/games/${game}`);
	}

	public static update(game: Id, payload: GameUpdatePayload) {
		return gameCatalogClient.patch<'/games/:id'>(`/games/${game}`, payload);
	}

	public static delete(game: Id) {
		return gameCatalogClient.delete<'/games/:id'>(`/games/${game}`);
	}
}
