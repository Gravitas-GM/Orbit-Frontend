import {Create, Entity, hubApiClient, Id, Projectable, Projection, Queryable, QueryDocument, Stub, Update} from '../..';
import {Permission} from '../../../Permission';
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
			params: Id;
			response: User;
		};

		PATCH: {
			params: Id;
			body: UserUpdatePayload;
			response: User;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

export interface User extends Entity {
	account: Stub<Account>;
	emailAddress: string;
	permissions: Permission[];
	firstName?: string | null;
	lastName?: string | null;
}

export type UserCreatePayload = Create<User, 'account' | 'emailAddress', 'permissions'> & {
	admin?: boolean;
};

export type UserUpdatePayload = Update<User, 'account' | 'permissions'> & {
	admin?: boolean;
};

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

	public static read(user: Id) {
		return hubApiClient.get<'/users/:id'>(`/users/${user}`);
	}

	public static update(user: Id, payload: UserUpdatePayload) {
		return hubApiClient.patch<'/users/:id'>(`/users/${user}`, payload);
	}

	public static delete(user: Id) {
		return hubApiClient.delete<'/users/:id'>(`/users/${user}`);
	}
}
