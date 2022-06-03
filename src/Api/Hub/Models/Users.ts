import {hubApiClient} from '../..';
import {Account} from './Accounts';

export interface UserEndpoints {
	'/users': {
		GET: {
			response: User[];
		};

		PUT: {
			body: UserCreatePayload;
			response: User;
		};
	};

	'/users/:id': {
		GET: {
			response: User;
		};

		PATCH: {
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
	public static list() {
		return hubApiClient.get('/users');
	}

	public static create(payload: UserCreatePayload) {
		return hubApiClient.put('/users', payload);
	}

	public static read(id: number) {
		return hubApiClient.get<'/users/:id'>(`/users/${id}`);
	}

	public static update(id: number, payload: UserUpdatePayload) {
		return hubApiClient.patch<'/users/:id'>(`/users/${id}`, payload);
	}
}
