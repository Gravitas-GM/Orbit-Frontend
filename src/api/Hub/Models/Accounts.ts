import {Create, Entity, hubApiClient, Id, Projectable, Projection} from '../..';

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
			params: Id;
			response: void;
		};
	};
}

export interface Account extends Entity {
	name: string;
}

export type AccountCreatePayload = Create<Account, 'name'>;

export class AccountModel {
	public static create(payload: AccountCreatePayload, projection?: Projection) {
		return hubApiClient.put('/accounts', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(account: Id) {
		return hubApiClient.delete<'/accounts/:account'>(`/accounts/${account}`);
	}
}
