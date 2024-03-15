import {
	Create,
	Entity,
	Id,
	Projectable,
	Projection,
	Stub,
	surveyClient,
	Update,
} from '../../index';
import {BankSurvey} from './BankSurveys';

export interface BankQuestionEndpoints {
	'/survey-bank/questions': {
		PUT: {
			query: Projectable;
			body: BankQuestionCreate;
			response: BankQuestion;
		};
	};

	'/survey-bank/questions/:question': {
		GET: {
			params: Id;
			response: BankQuestion;
		};

		PATCH: {
			params: Id;
			body: BankQuestionUpdate;
			response: BankQuestion;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

export enum SurveyQuestionKind {
	FreeText = 'free text',
	Choice = 'choice',
	Scale = 'scale',
}

interface BankQuestionBase extends Entity {
	survey: Stub<BankSurvey>;
	kind: SurveyQuestionKind;
	prompt: string;
}

export interface FreeTextQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.FreeText;
}

export interface ScaleQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.Scale;
	startValue: number;
	endValue: number;
	stepAmount: number;
}

export interface ChoiceQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.Choice;
	choices: string[];
}

export type BankQuestion = FreeTextQuestion | ScaleQuestion | ChoiceQuestion;

export type BankQuestionCreate = Create<FreeTextQuestion> | Create<ScaleQuestion> | Create<ChoiceQuestion>;
export type BankQuestionUpdate = (Update<FreeTextQuestion> | Update<ScaleQuestion> | Update<ChoiceQuestion>) & {
	kind: SurveyQuestionKind,
};

export class BankQuestionModel {
	public static create(payload: BankQuestionCreate, projection?: Projection) {
		return surveyClient.put('/survey-bank/questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(question: Id, projection?: Projection) {
		return surveyClient.get<'/survey-bank/questions/:question'>(`/survey-bank/questions/${question}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(question: Id, payload: BankQuestionUpdate, projection?: Projection) {
		return surveyClient.patch<'/survey-bank/questions/:question'>(`/survey-bank/questions/${question}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(question: Id) {
		return surveyClient.delete<'/survey-bank/questions/:question'>(`/survey-bank/questions/${question}`);
	}
}
