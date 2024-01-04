import {Create, Entity, Id, Projectable, Projection, QueryDocument, Stub, surveyClient, Update} from '../../index';
import {Settings} from './Settings';

export interface SurveyEndpoints {
	'/surveys': {
		GET: {
			response: SurveySubmission[];
		};

		PUT: {
			query: Projectable;
			body: SurveySubmissionPayload;
			response: SurveySubmission;
		};
	};

	'/surveys/:submission': {
		POST: {
			params: Id;
			body: SurveySubmissionFilter;
			response: SurveySubmission;
		}
	}

	'/surveys/current': {
		GET: {
			response: Survey;
		}
	}

	'/surveys/next': {
		GET: {
			response: Survey;
		}

		PATCH: {
			params: Id;
			body: SurveyUpdatePayload;
			response: Survey;
		}
	}
}

export enum SurveyQuestionKind {
	FreeText = 'free text',
	MultipleChoice = 'multiple choice',
	Scale = 'scale',
}

interface QuestionBase extends Entity {
	survey: Stub<Survey>;
	kind: SurveyQuestionKind;
	prompt: string;
}

export interface FreeTextQuestion extends QuestionBase {
	kind: SurveyQuestionKind.FreeText;
}

export interface ScaleQuestion extends QuestionBase {
	kind: SurveyQuestionKind.Scale;
	minValue: number;
	maxValue: number;
}

export interface MultipleChoiceQuestion extends QuestionBase {
	kind: SurveyQuestionKind.MultipleChoice;
	choices: string[];
}

export type Question = FreeTextQuestion | ScaleQuestion | MultipleChoiceQuestion;

export interface Survey extends Entity {
	account: Stub<Settings>;
	startedDate: Date;
	questions: Question[];
}

interface SurveyResponseBase extends Entity {
	question: Stub<Question>;
	kind: SurveyQuestionKind;
}

export interface FreeTextResponse extends SurveyResponseBase {
	kind: SurveyQuestionKind.FreeText;
	response: string;
}

export interface ScaleResponse extends SurveyResponseBase {
	kind: SurveyQuestionKind.Scale;
	response: number;
}

export interface MultipleChoiceResponse extends SurveyResponseBase {
	kind: SurveyQuestionKind.MultipleChoice;
	responseIndex: number;
}

export type SurveyResponse = FreeTextResponse | ScaleResponse | MultipleChoiceResponse;

export interface SurveySubmission extends Entity {
	survey: Stub<Survey>;
	submittedDate: Date;
	responses: SurveyResponse[];
}

export interface SurveySubmissionFilter {
	drillDown: boolean;
}

export type SurveyUpdatePayload = Update<Survey, 'questions'> & {
	questions: Update<Question>[];
};

export type SurveySubmissionPayload = Create<SurveySubmission, 'responses'> & {
	responses: Create<SurveyResponse>[];
};

export class SurveyModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return surveyClient.get('/surveys', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static submit(payload: SurveySubmissionPayload, projection?: Projection) {
		return surveyClient.put('/surveys', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(submission: Id, payload: SurveySubmissionFilter, projection?: Projection) {
		return surveyClient.post<'/surveys/:submission'>(`/surveys/${submission}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static takeSurvey() {
		return surveyClient.get('/surveys/current');
	}

	public static readNext(projection?: Projection) {
		return surveyClient.get('/surveys/next', {
			params: {
				p: projection,
			},
		});
	}

	public static updateNext(payload: SurveyUpdatePayload, projection?: Projection) {
		return surveyClient.patch('/surveys/next', payload, {
			params: {
				p: projection,
			},
		});
	}
}
