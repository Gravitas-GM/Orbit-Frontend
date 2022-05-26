import {hubApiClient} from '../..';
import {Account} from './Accounts';

export interface UserEndpoints {
	'/users': {
		PUT: {
			body: UserCreatePayload;
			response: User;
		};
	};

	'/users/:id': {
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

export class UserApi {
	public static create(payload: UserCreatePayload) {
		return hubApiClient.put('/users', payload);
	}

	public static update(id: number, payload: UserUpdatePayload) {
		return hubApiClient.patch<'/users/:id'>(`/users/${id}`, payload);
	}
}
