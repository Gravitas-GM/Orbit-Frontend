import {Create, Entity, Id, Projectable, Projection, QueryDocument, Stub, surveyClient, Update} from '../../index';
import {SurveyQuestionKind} from './BankQuestions';
import {Settings} from './Settings';
import {SurveyQuestion} from './SurveyQuestions';

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

	'/surveys/:survey': {
		POST: {
			params: Id;
			body: SurveySubmissionFilter;
			response: Survey;
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
	}
}

export interface Survey extends Entity {
	account: Stub<Settings>;
	startedDate: Date;
	questions: SurveyQuestion[];
}

interface SurveyResponseBase extends Entity {
	question: Stub<SurveyQuestion>;
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
	kind: SurveyQuestionKind.Choice;
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

	public static read(survey: Id, payload: SurveySubmissionFilter, projection?: Projection) {
		return surveyClient.post<'/surveys/:survey'>(`/surveys/${survey}`, payload, {
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
}
