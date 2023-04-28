import {Id, quizClient} from '../../index';

export interface AccountsEndpoints {
	'/accounts': {
		PUT: {
			body: Account;
			response: Account;
		};
	};

	'/accounts/:account': {
		DELETE: {
			params: Id;
			response: void;
		};
	};

	'/settings/:account': {
		GET: {
			params: Id;
			response: Account;
		};

		PATCH: {
			params: Id;
			body: AccountUpdatePayload;
			response: Account;
		};
	}
}

export interface Account {
	accountId: number,
	quizFrequency: Frequency,
	questionCount: number,
	completedRewardPointSourceId: string | null,
}

export enum Frequency {
	Daily = 'daily',
	Weekly = 'weekly',
	Monthly = 'monthly',
}

export type AccountUpdatePayload = Partial<Omit<Account, 'accountId'>>;

export class SettingsModel {
	public static create(payload: Account) {
		return quizClient.put('/accounts', payload);
	}

	public static read(account: Id) {
		return quizClient.get<'/settings/:account'>(`/settings/${account}`);
	}

	public static update(account: Id, payload: AccountUpdatePayload) {
		return quizClient.patch<'/settings/:account'>(`/settings/${account}`, payload);
	}

	public static delete(account: Id) {
		return quizClient.delete<'/accounts/:account'>(`/accounts/${account}`);
	}
}
