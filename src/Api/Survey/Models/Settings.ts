import {Id, Projectable, Projection, surveyClient} from '../../index';

export interface SettingsEndpoints {
	'/settings/:account': {
		GET: {
			query: Projectable;
			params: Id;
			response: Settings;
		};

		PATCH: {
			query: Projectable;
			params: Id;
			body: SettingsUpdatePayload;
			response: Settings;
		};
	};
}

export enum DayOfWeek {
	MONDAY = 'monday',
	TUESDAY = 'tuesday',
	WEDNESDAY = 'wednesday',
	THURSDAY = 'thursday',
	FRIDAY = 'friday',
	SATURDAY = 'saturday',
	SUNDAY = 'sunday',
}

export interface Settings {
	id: Id,
	surveyRefreshDAy: DayOfWeek,
}

export type SettingsUpdatePayload = Partial<Omit<Settings, 'id'>>;

export class SettingsModel {
	public static read(account: Id, projection?: Projection) {
		return surveyClient.get<'/settings/:account'>(`/settings/${account}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(account: Id, payload: SettingsUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/settings/:account'>(`/settings/${account}`, payload, {
			params: {
				p: projection,
			},
		});
	}
}
