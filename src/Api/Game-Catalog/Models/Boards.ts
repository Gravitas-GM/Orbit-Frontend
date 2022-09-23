import {gameCatalogClient, Id, Projectable, Projection, QueryDocument} from '../..';
import {Stage} from './Stages';

export interface BoardEndpoints {
	'/boards': {
		PUT: {
			query: Projectable;
			body: BoardCreatePayload;
			response: Board;
		};
	};

	'/boards/:id': {
		GET: {
			params: Id;
			response: Board;
		};

		PATCH: {
			params: Id;
			body: BoardUpdatePayload;
			response: Board;
		};

		DELETE: {
			params: Id;
			response: void;
		}
	};
}

export interface Board {
	id: number;
	name: string;
	game: number;
	sequence: number;
	image: string;
	stages: Stage[];
}

export type BoardCreatePayload = Omit<Board, 'id' | 'stages'>;

export type BoardUpdatePayload = Partial<Omit<Board, 'id' | 'stages'>>;

export class BoardModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return gameCatalogClient.get('/boards', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: BoardCreatePayload, projection?: Projection) {
		return gameCatalogClient.put('/boards', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(board: Id) {
		return gameCatalogClient.get<'/boards/:id'>(`/boards/${board}`);
	}

	public static update(board: Id, payload: BoardUpdatePayload) {
		return gameCatalogClient.patch<'/boards/:id'>(`/boards/${board}`, payload);
	}

	public static delete(board: Id) {
		return gameCatalogClient.delete<'/boards/:id'>(`/boards/${board}`);
	}
}
