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
import {Surveys} from './Surveys';

export interface SurveyQuestionEndpoints {
	'/survey-questions': {
		PUT: {
			query: Projectable;
			body: SurveyQuestionCreate;
			response: SurveyQuestion;
		};
	};

	'/survey-questions/:question': {
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
	survey: Stub<Surveys>;
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
	kind: SurveyQuestionKind.MultipleChoice;
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
		return surveyClient.put('/survey-questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(question: Id, projection?: Projection) {
		return surveyClient.get<'/survey-questions/:question'>(`/survey-questions/${question}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(question: Id, payload: SurveyQuestionUpdate, projection?: Projection) {
		return surveyClient.patch<'/survey-questions/:question'>(`/survey-questions/${question}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(question: Id) {
		return surveyClient.delete<'/survey-questions/:question'>(`/survey-questions/${question}`);
	}
}
