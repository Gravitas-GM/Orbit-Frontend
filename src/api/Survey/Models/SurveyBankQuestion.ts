import {Create, Id, Projectable, Projection, Stub, surveyClient, Update} from '../../index';
import {BaseChoiceQuestion, BaseFreeTextQuestion, BaseScaleQuestion, Question} from '../index';
import {BankSurvey} from './SurveyBank';

export interface SurveyBankQuestionEndpoints {
	'/survey-bank/questions': {
		PUT: {
			query: Projectable,
			response: BankQuestion,
		},
	},

	'/survey-bank/questions/:question': {
		PATCH: {
			params: Id,
			query: Projectable,
			response: BankQuestion,
		},

		GET: {
			params: Id,
			query: Projectable,
			response: BankQuestion,
		},

		DELETE: {
			params: Id,
			response: void,
		},
	},
}

type WithBankSurvey<T extends Question> = T & {
	survey: Stub<BankSurvey>,
};

export type BankFreeTextQuestion = WithBankSurvey<BaseFreeTextQuestion>;
export type BankChoiceQuestion = WithBankSurvey<BaseChoiceQuestion>;
export type BankScaleQuestion = WithBankSurvey<BaseScaleQuestion>;

export type BankQuestion = BankFreeTextQuestion | BankChoiceQuestion | BankScaleQuestion;

export type BankQuestionCreatePayload = Create<BankQuestion>;
export type BankQuestionUpdatePayload = Update<BankQuestion>;

export class SurveyBankQuestionModel {
	public static create(data: BankQuestionCreatePayload, projection?: Projection) {
		return surveyClient.put('/survey-bank/questions', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection) {
		return surveyClient.get<'/survey-bank/questions/:question'>(`/survey-bank/questions/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: BankQuestionUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/survey-bank/questions/:question'>(`/survey-bank/questions/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return surveyClient.delete<'/survey-bank/questions/:question'>(`/survey-bank/questions/${id}`);
	}
}
