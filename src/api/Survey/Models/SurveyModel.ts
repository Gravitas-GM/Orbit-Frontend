import {parseApiTimestamp} from '../../../utility/date';
import {Account} from '../../Hub/Models/Accounts';
import {Create, Entity, Projectable, Projection, QueryDocument, Stub, surveyClient} from '../../index';
import {QuestionKind} from '../index';
import {SurveyQuestion} from './SurveyQuestion';

export interface SurveyEndpoints {
	'/surveys': {
		GET: {
			response: Survey[],
		},

		PUT: {
			query: Projectable,
			body: SubmissionPayload,
			response: SurveySubmission,
		},
	},

	'/surveys/next': {
		GET: {
			query: Projectable,
			response: Survey,
		},
	},
}

export interface Survey extends Entity {
	account: Stub<Account>,
	startedDate: Date,
	questions: SurveyQuestion[],
}

interface BaseResponse extends Entity {
	kind: QuestionKind,
	question: Stub<SurveyQuestion>,
	submission: Stub<SurveySubmission>,
}

export interface FreeTextResponse extends BaseResponse {
	kind: QuestionKind.FreeText,
	response: string,
}

export interface ChoiceResponse extends BaseResponse {
	kind: QuestionKind.Choice,
	responseIndex: number,
}

export interface ScaleResponse extends BaseResponse {
	kind: QuestionKind.Scale,
	response: number,
}

export type SurveyResponse = FreeTextResponse | ChoiceResponse | ScaleResponse;

export interface SurveySubmission extends Entity {
	survey: Stub<Survey>,
	submittedDate: Date,
	responses: SurveyResponse[],
}

export type SubmissionPayload = Create<SurveySubmission>;

export class SurveyModel {
	public static async list(projection?: Projection, query?: QueryDocument) {
		const response = await surveyClient.get('/surveys', {
			params: {
				p: projection,
				q: query,
			},
		});

		response.data = response.data.map(SurveyModel.denormalize);

		return response;
	}

	public static create(submission: SubmissionPayload, projection?: Projection) {
		return surveyClient.put('/surveys', submission, {
			params: {
				p: projection,
			},
		});
	}

	public static readNext(projection?: Projection) {
		return surveyClient.get('/surveys/next', {
			params: {
				p: projection,
			},
		});
	}

	protected static denormalize(survey: Survey): Survey {
		survey.startedDate = parseApiTimestamp(survey.startedDate);

		return survey;
	}
}
