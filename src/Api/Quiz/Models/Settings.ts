import {Entity, Id, Projection, quizClient, Update} from '../../index';

export interface SettingsEndpoints {
	'/settings/:account': {
		GET: {
			params: Id;
			response: Settings;
		};

		PATCH: {
			params: Id;
			body: SettingsUpdatePayload;
			response: Settings;
		};
	};
}

export interface Settings extends Entity {
	quizFrequency: Frequency,
	questionCount: number,
	completedRewardPointSourceId: string | null,
	quizDurationSeconds: number | null,
}

export enum Frequency {
	Daily = 'daily',
	Weekly = 'weekly',
	Monthly = 'monthly',
}

export type SettingsUpdatePayload = Update<Settings>;

export class SettingsModel {
	public static read(account: Id, projection?: Projection) {
		return quizClient.get<'/settings/:account'>(`/settings/${account}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(account: Id, payload: SettingsUpdatePayload, projection?: Projection) {
		return quizClient.patch<'/settings/:account'>(`/settings/${account}`, payload, {
			params: {
				p: projection,
			},
		});
	}
}
