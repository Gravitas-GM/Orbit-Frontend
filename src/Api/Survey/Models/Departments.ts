import {Id, Projectable, Projection, Queryable, QueryDocument, surveyClient} from '../../index';

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
	}
}

export interface Department {
	id: Id,
	name: string,
	allowSplitReporting: boolean,
}

export type DepartmentUpdatePayload = Partial<Omit<Department, 'id'>>;

export class DepartmentModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return surveyClient.get('/departments', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: DepartmentUpdatePayload, projection?: Projection) {
		return surveyClient.put('/departments', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(department: Id, projection?: Projection) {
		return surveyClient.get<'/departments/:department'>(`/departments/${department}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(department: Id, payload: DepartmentUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/departments/:department'>(`/departments/${department}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(department: Id) {
		return surveyClient.delete<'/departments/:department'>(`/departments/${department}`);
	}
}
