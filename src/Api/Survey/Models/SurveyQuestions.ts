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
import {SurveyQuestionKind} from './BankQuestions';
import {Survey} from './Surveys';

export interface SurveyQuestionEndpoints {
	'/surveys/next/questions': {
		PUT: {
			query: Projectable;
			body: SurveyQuestionCreate;
			response: SurveyQuestion;
		};
	};

	'/surveys/next/questions/:question': {
		GET: {
			params: Id;
			response: SurveyQuestion;
		};

		PATCH: {
			params: Id;
			body: SurveyQuestionUpdate;
			response: SurveyQuestion;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

interface SurveyQuestionBase extends Entity {
	survey: Stub<Survey>;
	kind: SurveyQuestionKind;
	prompt: string;
}

export interface FreeTextQuestion extends SurveyQuestionBase {
	kind: SurveyQuestionKind.FreeText;
}

export interface ScaleQuestion extends SurveyQuestionBase {
	kind: SurveyQuestionKind.Scale;
	minValue: number;
	maxValue: number;
}

export interface MultipleChoiceQuestion extends SurveyQuestionBase {
	kind: SurveyQuestionKind.Choice;
	choices: string[];
}

export type SurveyQuestion = FreeTextQuestion | ScaleQuestion | MultipleChoiceQuestion;

export type SurveyQuestionCreate = Create<FreeTextQuestion> | Create<ScaleQuestion> | Create<MultipleChoiceQuestion>;
export type SurveyQuestionUpdate =
	(Update<FreeTextQuestion> | Update<ScaleQuestion> | Update<MultipleChoiceQuestion>) & {
	kind: SurveyQuestionKind,
};

export class SurveyQuestionModel {
	public static create(payload: SurveyQuestionCreate, projection?: Projection) {
		return surveyClient.put('/surveys/next/questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(question: Id, projection?: Projection) {
		return surveyClient.get<'/surveys/next/questions/:question'>(`/surveys/next/questions/${question}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(question: Id, payload: SurveyQuestionUpdate, projection?: Projection) {
		return surveyClient.patch<'/surveys/next/questions/:question'>(`/surveys/next/questions/${question}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(question: Id) {
		return surveyClient.delete<'/surveys/next/questions/:question'>(`/surveys/next/questions/${question}`);
	}
}
