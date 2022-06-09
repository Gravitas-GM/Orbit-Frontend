import {hubApiClient, Projectable, Projection, Queryable, QueryDocument} from '../..';
import {Account} from './Accounts';

export interface UserEndpoints {
	'/users': {
		GET: {
			query: Queryable & Projectable;
			response: User[];
		};

		PUT: {
			query: Projectable;
			body: UserCreatePayload;
			response: User;
		};
	};

	'/users/:id': {
		GET: {
			params: number;
			response: User;
		};

		PATCH: {
			params: number;
			body: UserUpdatePayload;
			response: User;
		};
	};
}

export interface User {
	id: number;
	account: Pick<Account, 'id'>;
	emailAddress: string;
	admin: boolean;
	firstName?: string | null;
	lastName?: string | null;
}

export type UserCreatePayload = Omit<User, 'id' | 'account' | 'admin'> & {
	account: number;
	admin?: boolean;
};

export type UserUpdatePayload = Partial<Omit<User, 'id' | 'account'>>;

export class UserModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return hubApiClient.get('/users', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: UserCreatePayload, projection?: Projection) {
		return hubApiClient.put('/users', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: number) {
		return hubApiClient.get<'/users/:id'>(`/users/${id}`);
	}

	public static update(id: number, payload: UserUpdatePayload) {
		return hubApiClient.patch<'/users/:id'>(`/users/${id}`, payload);
	}
}
