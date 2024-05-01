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

export enum WeekDay {
	SUNDAY,
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
}

export const WEEKDAY_VALUES = [
	WeekDay.SUNDAY,
	WeekDay.MONDAY,
	WeekDay.TUESDAY,
	WeekDay.WEDNESDAY,
	WeekDay.THURSDAY,
	WeekDay.FRIDAY,
	WeekDay.SATURDAY,
];

export const WEEKDAY_DISPLAY_NAMES = {
	[WeekDay.SUNDAY]: 'Sunday',
	[WeekDay.MONDAY]: 'Monday',
	[WeekDay.TUESDAY]: 'Tuesday',
	[WeekDay.WEDNESDAY]: 'Wednesday',
	[WeekDay.THURSDAY]: 'Thursday',
	[WeekDay.FRIDAY]: 'Friday',
	[WeekDay.SATURDAY]: 'Saturday',
};

export interface Settings extends Entity {
	surveyRefreshDay: WeekDay;
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
