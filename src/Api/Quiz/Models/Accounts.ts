import {Id, quizClient} from '../../index';

export interface AccountEndpoints {
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
	};
}

export interface Account {
	id: number,
	quizFrequency: Frequency,
	questionCount: number,
	completedRewardPointSourceId: string | null,
}

export enum Frequency {
	Daily = 'daily',
	Weekly = 'weekly',
	Monthly = 'monthly',
}

export type AccountUpdatePayload = Partial<Omit<Account, 'id'>>;

export class AccountModel {
	public static read(account: Id) {
		return quizClient.get<'/settings/:account'>(`/settings/${account}`);
	}

	public static update(account: Id, payload: AccountUpdatePayload) {
		return quizClient.patch<'/settings/:account'>(`/settings/${account}`, payload);
	}
}
