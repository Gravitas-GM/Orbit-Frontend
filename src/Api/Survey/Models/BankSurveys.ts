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

	'/survey-bank/:survey': {
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

	'/survey-bank/update-order': {
		PATCH: {
			query: Projectable & Queryable;
			body: UpdateOrderPayload;
			response: BankSurvey[];
		}
	}

	'/survey-bank/:survey/update-order': {
		PATCH: {
			params: Id;
			query: Projectable & Queryable;
			body: UpdateOrderPayload;
			response: BankSurvey[];
		}
	}
}

export interface BankSurvey extends Entity {
	week: number;
	questions: BankQuestion[];
}

export type UpdateOrderPayload = {
	order: number[];
}

export type BankSurveyCreatePayload = Create<BankSurvey, keyof BankSurvey, 'week' | 'questions'>;
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

	public static updateOrder(payload: UpdateOrderPayload, projection?: Projection, query?: QueryDocument) {
		return surveyClient.patch('/survey-bank/update-order', payload, {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static updateQuestionOrder(survey: Id, payload: UpdateOrderPayload, projection?: Projection, query?: QueryDocument) {
		return surveyClient.patch<'/survey-bank/:survey/update-order'>(`/survey-bank/${survey}/update-order`, payload, {
			params: {
				p: projection,
				q: query,
			},
		});
	}


	public static read(survey: Id, projection?: Projection) {
		return surveyClient.get<'/survey-bank/:survey'>(`/survey-bank/${survey}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(survey: Id, payload: BankSurveyUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/survey-bank/:survey'>(`/survey-bank/${survey}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(survey: Id) {
		return surveyClient.delete<'/survey-bank/:survey'>(`/survey-bank/${survey}`);
	}
}
