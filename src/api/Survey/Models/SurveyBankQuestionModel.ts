import {Entity, Id, Stub, surveyClient} from '../../index';
import {BaseChoiceQuestion, BaseFreeTextQuestion, BaseQuestion, BaseScaleQuestion} from '../index';
import {BankSurvey} from './SurveyBankModel';

export interface SurveyBankQuestionEndpoints {
	'/survey-bank/questions/:question': {
		DELETE: {
			params: Id,
			response: void,
		},
	},
}

type WithBankSurvey<T extends BaseQuestion> = T & {
	survey: Stub<BankSurvey>,
};

export type BankFreeTextQuestion = WithBankSurvey<BaseFreeTextQuestion>;
export type BankChoiceQuestion = WithBankSurvey<BaseChoiceQuestion>;
export type BankScaleQuestion = WithBankSurvey<BaseScaleQuestion>;

export type BankQuestion = BankFreeTextQuestion | BankChoiceQuestion | BankScaleQuestion;

export class SurveyBankQuestionModel {
	public static delete(id: Id) {
		return surveyClient.delete<'/survey-bank/questions/:question'>(`/survey-bank/questions/${id}`);
	}
}
