import {Entity, Id, Projectable, Projection, surveyClient, Update} from '../../index';

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
	SUNDAY = 'sunday',
	MONDAY = 'monday',
	TUESDAY = 'tuesday',
	WEDNESDAY = 'wednesday',
	THURSDAY = 'thursday',
	FRIDAY = 'friday',
	SATURDAY = 'saturday',
}

export interface Settings extends Entity {
	surveyRefreshDay: DayOfWeek;
	userSurveyReminder: boolean;
}

export type SettingsUpdatePayload = Update<Settings>;

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
