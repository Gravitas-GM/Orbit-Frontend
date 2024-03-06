import {
	Create,
	Entity,
	Id,
	Projectable,
	Projection,
	Queryable,
	QueryDocument,
	surveyClient,
	Update,
} from '../../index';
import {BankQuestion} from './BankQuestions';

export interface SurveyBankEndpoints {
	'/survey-bank': {
		GET: {
			query: Projectable & Queryable;
			response: BankSurvey[];
		};

		PUT: {
			query: Projectable;
			body: BankSurveyUpdatePayload;
			response: BankSurvey;
		};
	};

	'/survey-bank/:bankSurvey': {
		GET: {
			query: Projectable;
			response: BankSurvey;
		};

		PATCH: {
			query: Projectable;
			params: Id;
			body: BankSurveyUpdatePayload;
			response: BankSurvey;
		}

		DELETE: {
			params: Id;
			response: void;
		}
	};
}

export interface BankSurvey extends Entity {
	week: number;
	protected: boolean;
	questions: BankQuestion[];
}

export type BankSurveyCreatePayload = Create<BankSurvey, 'protected'>;
export type BankSurveyUpdatePayload = Update<BankSurvey, 'questions' | 'week'>;

export class BankSurveyModel {
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

	public static read(bankSurvey: Id, projection?: Projection) {
		return surveyClient.get<'/survey-bank/:bankSurvey'>(`/survey-bank/${bankSurvey}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(bankSurvey: Id, payload: BankSurveyUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/survey-bank/:bankSurvey'>(`/survey-bank/${bankSurvey}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(bankSurvey: Id) {
		return surveyClient.delete<'/survey-bank/:bankSurvey'>(`/survey-bank/${bankSurvey}`);
	}
}
