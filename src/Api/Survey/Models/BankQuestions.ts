import {
	Create,
	Entity,
	Id,
	Projectable,
	Projection,
	surveyClient,
	Update,
} from '../../index';

export interface BankQuestionEndpoints {
	'/survey-bank/questions': {
		PUT: {
			query: Projectable;
			body: QuestionCreate;
			response: Question;
		};
	};

	'/survey-bank/questions/:question': {
		GET: {
			params: Id;
			response: Question;
		};

		PATCH: {
			params: Id;
			body: QuestionUpdate;
			response: Question;
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

interface QuestionBase extends Entity {
	survey: number;
	kind: SurveyQuestionKind;
	prompt: string;
}

export interface FreeTextQuestion extends QuestionBase {
	kind: SurveyQuestionKind.FreeText;
}

export interface ScaleQuestion extends QuestionBase {
	kind: SurveyQuestionKind.Scale;
	startValue: number;
	endValue: number;
	stepAmount: number;
}

export interface ChoiceQuestion extends QuestionBase {
	kind: SurveyQuestionKind.Choice;
	choices: string[];
}

export type Question = FreeTextQuestion | ScaleQuestion | ChoiceQuestion;

export type QuestionCreate = Create<FreeTextQuestion> | Create<ScaleQuestion> | Create<ChoiceQuestion>;
export type QuestionUpdate = (Update<FreeTextQuestion> | Update<ScaleQuestion> | Update<ChoiceQuestion>) & {
	kind: SurveyQuestionKind,
};

export class BankQuestionModel {
	public static create(payload: QuestionCreate, projection?: Projection) {
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

	public static update(question: Id, payload: QuestionUpdate, projection?: Projection) {
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
