import {Id, Projection, quizClient} from '../../index';

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

export interface Settings {
	id: number,
	quizFrequency: Frequency,
	questionCount: number,
	completedRewardPointSourceId: string | null,
	quizDurationSeconds: number,
}

export enum Frequency {
	Daily = 'daily',
	Weekly = 'weekly',
	Monthly = 'monthly',
}

export type SettingsUpdatePayload = Partial<Omit<Settings, 'id'>>;

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
