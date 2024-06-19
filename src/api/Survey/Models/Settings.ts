import {Id, Identity, Projectable, Projection, surveyClient, WeekDay} from '../../index';

export interface SettingsEndpoints {
	'/settings/:id': {
		GET: {
			params: Identity,
			query: Projectable,
			response: Settings,
		},

		PATCH: {
			params: Identity,
			query: Projectable,
			body: SettingsUpdatePayload,
			response: Settings,
		},
	},
}

export interface Settings {
	surveyRefreshDay: WeekDay,
	userSurveyReminder: boolean,
}

export type SettingsUpdatePayload = Partial<Settings>;

export class SettingsModel {
	public static read(accountId: Id, projection?: Projection) {
		return surveyClient.get<'/settings/:id'>(`/settings/${accountId}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(accountId: Id, data: SettingsUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/settings/:id'>(`/settings/${accountId}`, data, {
			params: {
				p: projection,
			},
		});
	}
}
