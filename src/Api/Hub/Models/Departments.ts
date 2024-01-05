import {Create, Entity, hubApiClient, Id, Projectable, Projection, Queryable, QueryDocument, Update} from '../../index';

export interface DepartmentEndpoints {
	'/departments': {
		GET: {
			query: Projectable & Queryable;
			response: Department[];
		};

		PUT: {
			query: Projectable;
			body: DepartmentUpdatePayload;
			response: Department;
		};
	};

	'/departments/:department': {
		GET: {
			query: Projectable;
			response: Department;
		};

		PATCH: {
			query: Projectable;
			params: Id;
			body: DepartmentUpdatePayload;
			response: Department;
		}

		DELETE: {
			params: Id;
			response: void;
		}
	};
}

export interface Department extends Entity {
	name: string;
	allowSplitReporting: boolean;
}

export type DepartmentCreatePayload = Create<Department>;
export type DepartmentUpdatePayload = Update<Department>;

export class DepartmentModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return hubApiClient.get('/departments', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: DepartmentCreatePayload, projection?: Projection) {
		return hubApiClient.put('/departments', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(department: Id, projection?: Projection) {
		return hubApiClient.get<'/departments/:department'>(`/departments/${department}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(department: Id, payload: DepartmentUpdatePayload, projection?: Projection) {
		return hubApiClient.patch<'/departments/:department'>(`/departments/${department}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(department: Id) {
		return hubApiClient.delete<'/departments/:department'>(`/departments/${department}`);
	}
}
