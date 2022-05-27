import { hubApiClient } from "../..";

export interface AccountEndpoints {
	'/accounts': {
		PUT: {
			body: AccountCreatePayload;
			response: Account;
		};
	};

	'/accounts/:account': {
		DELETE: {
			response: void;
		};
	};
}

export interface Account {
	id: number;
	name: string;
}

export type AccountCreatePayload = Omit<Account, 'id'>;

export class AccountApi {
	public static create(payload: AccountCreatePayload) {
		return hubApiClient.put('/accounts', payload);
	}

	public static delete(id: number) {
		return hubApiClient.delete<'/accounts/:account'>(`/accounts/${id}`);
	}
}
