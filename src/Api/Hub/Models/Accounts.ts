import {hubApiClient, Projectable, Projection} from '../..';

export interface AccountEndpoints {
	'/accounts': {
		PUT: {
			query: Projectable;
			body: AccountCreatePayload;
			response: Account;
		};
	};

	'/accounts/:account': {
		DELETE: {
			params: number;
			response: void;
		};
	};
}

export interface Account {
	id: number;
	name: string;
}

export type AccountCreatePayload = Omit<Account, 'id'>;

export class AccountModel {
	public static create(payload: AccountCreatePayload, projection?: Projection) {
		return hubApiClient.put('/accounts', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: number) {
		return hubApiClient.delete<'/accounts/:account'>(`/accounts/${id}`);
	}
}
