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
	'/bank-questions': {
		PUT: {
			query: Projectable;
			body: BankQuestionCreate;
			response: BankQuestion;
		};
	};

	'/bank-questions/:question': {
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
	MultipleChoice = 'multiple choice',
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
	minValue: number;
	maxValue: number;
}

export interface MultipleChoiceQuestion extends BankQuestionBase {
	kind: SurveyQuestionKind.MultipleChoice;
	choices: string[];
}

export type BankQuestion = FreeTextQuestion | ScaleQuestion | MultipleChoiceQuestion;

export type BankQuestionCreate = Create<FreeTextQuestion> | Create<ScaleQuestion> | Create<MultipleChoiceQuestion>;
export type BankQuestionUpdate = (Update<FreeTextQuestion> | Update<ScaleQuestion> | Update<MultipleChoiceQuestion>) & {
	kind: SurveyQuestionKind,
};

export class BankQuestionModel {
	public static create(payload: BankQuestionCreate, projection?: Projection) {
		return surveyClient.put('/bank-questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(question: Id, projection?: Projection) {
		return surveyClient.get<'/bank-questions/:question'>(`/bank-questions/${question}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(question: Id, payload: BankQuestionUpdate, projection?: Projection) {
		return surveyClient.patch<'/bank-questions/:question'>(`/bank-questions/${question}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(question: Id) {
		return surveyClient.delete<'/bank-questions/:question'>(`/bank-questions/${question}`);
	}
}
