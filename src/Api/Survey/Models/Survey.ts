import {Id, Projectable, Projection, QueryDocument, surveyClient} from '../../index';
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

interface QuestionBase {
	id: Id;
	survey: Pick<Survey, 'id'>;
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

export interface Survey {
	id: Id;
	account: Pick<Settings, 'id'>;
	startedDate: Date;
	questions: Question[];
}

interface SurveyResponseBase {
	id: Id;
	question: Pick<Question, 'id'>;
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

export interface SurveySubmission {
	id: Id;
	survey: Pick<Survey, 'id'>;
	submittedDate: Date;
	responses: SurveyResponse[];
}

export interface SurveySubmissionFilter {
	drillDown: boolean;
}

export type QuestionUpdate = Omit<Question, 'id'>;
export type SurveyUpdatePayload = Omit<Survey, 'id' | 'questions'> & {
	questions: QuestionUpdate[];
};

export type SurveyResponseUpdate = Omit<SurveyResponse, 'id'>;
export type SurveySubmissionPayload = Omit<SurveySubmission, 'id' | 'responses'> & {
	responses: SurveyResponseUpdate[];
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
