import {Create, Entity, Id, Projectable, Projection, Queryable, QueryDocument, surveyClient, Update} from '../../index';
import {BankQuestion} from './SurveyBankQuestion';

export interface SurveyBankEndpoints {
	'/survey-bank': {
		GET: {
			query: Projectable & Queryable,
			response: BankSurvey[],
		},

		PUT: {
			query: Projectable,
			body: BankSurveyCreatePayload,
			response: BankSurvey,
		}
	},

	'/survey-bank/:survey': {
		GET: {
			params: Id,
			query: Projectable,
			response: BankSurvey,
		},

		PATCH: {
			params: Id,
			query: Projectable,
			body: BankSurveyUpdatePayload,
			response: BankSurvey,
		},

		DELETE: {
			params: Id,
			response: void,
		},
	},
}

export interface BankSurvey extends Entity {
	week: number,
	questions: BankQuestion[],
}

export type BankSurveyCreatePayload = Create<BankSurvey, keyof BankSurvey, 'week' | 'questions'>;
export type BankSurveyUpdatePayload = Update<BankSurvey, 'week' | 'questions'>;

export class SurveyBankModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return surveyClient.get('/survey-bank', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: BankSurveyCreatePayload, projection?: Projection) {
		return surveyClient.put('/survey-bank', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection) {
		return surveyClient.get<'/survey-bank/:survey'>(`/survey-bank/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, payload: BankSurveyUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/survey-bank/:survey'>(`/survey-bank/${id}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return surveyClient.delete<'/survey-bank/:survey'>(`/survey-bank/${id}`);
	}
}
