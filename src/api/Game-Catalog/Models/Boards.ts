import {Entity, gameCatalogClient, Id} from '../..';
import {Stage} from './Stages';

export interface BoardEndpoints {
	'/boards/:id': {
		GET: {
			params: Id;
			response: Board;
		};
	};
}

export interface Board extends Entity {
	name: string;
	game: number;
	sequence: number;
	imageUrl: string;
	stages: Stage[];
}

export class BoardModel {
	public static read(board: Id) {
		return gameCatalogClient.get<'/boards/:id'>(`/boards/${board}`);
	}
}
