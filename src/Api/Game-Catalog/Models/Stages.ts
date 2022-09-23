import {gameCatalogClient, Id, Projectable, Projection, QueryDocument} from '../..';

export interface StageEndpoints {
	'/stages': {
		PUT: {
			query: Projectable;
			body: StageCreatePayload;
			response: Stage;
		};
	};

	'/stages/:id': {
		GET: {
			params: Id;
			response: Stage;
		};

		PATCH: {
			params: Id;
			body: StageUpdatePayload;
			response: Stage;
		};

		DELETE: {
			params: Id;
			response: void;
		}
	};
}

export interface Stage {
	id: number;
	name: string;
	board: number;
	requiredPoints: number;
	positionX: number;
	positionY: number;
	positionWidth: number;
	positionHeight: number;
}

export type StageCreatePayload = Omit<Stage, 'id'>;

export type StageUpdatePayload = Partial<Omit<Stage, 'id'>>;

export class StageModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return gameCatalogClient.get('/stages', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: StageCreatePayload, projection?: Projection) {
		return gameCatalogClient.put('/stages', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(stage: Id) {
		return gameCatalogClient.get<'/stages/:id'>(`/stages/${stage}`);
	}

	public static update(stage: Id, payload: StageUpdatePayload) {
		return gameCatalogClient.patch<'/stages/:id'>(`/stages/${stage}`, payload);
	}

	public static delete(stage: Id) {
		return gameCatalogClient.delete<'/stages/:id'>(`/stages/${stage}`);
	}
}
