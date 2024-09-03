import {parseApiTimestamp} from '../../../utility/date';
import {Create, Entity, Projectable, Projection, Stub, surveyClient} from '../../index';
import {QuestionKind} from '../index';
import {Survey} from './Survey';
import {SurveyChoiceQuestion, SurveyFreeTextQuestion, SurveyQuestion, SurveyScaleQuestion} from './SurveyQuestion';

export interface SurveySubmissionEndpoints {
	'/surveys/submissions': {
		PUT: {
			params: Projectable,
			body: SurveySubmissionCreatePayload,
			response: SurveySubmission,
		},
	},
}

export interface SurveySubmission extends Entity {
	survey: Stub<Survey>,
	submittedDate: Date,
	responses: SurveyResponse[],
}

interface BaseResponse extends Entity {
	kind: QuestionKind,
	submission: Stub<SurveySubmission>,
	question: Stub<SurveyQuestion>,
}

export interface FreeTextResponse extends BaseResponse {
	kind: QuestionKind.FreeText,
	question: Stub<SurveyFreeTextQuestion>,
	response: string,
}

export interface ChoiceResponse extends BaseResponse {
	kind: QuestionKind.Choice,
	question: Stub<SurveyChoiceQuestion>,
	response: number,
}

export interface ScaleResponse extends BaseResponse {
	kind: QuestionKind.Scale,
	question: Stub<SurveyScaleQuestion>,
	response: number,
}

export type SurveyResponse = FreeTextResponse | ChoiceResponse | ScaleResponse;

export interface SurveySubmissionCreatePayload {
	responses: Array<Create<SurveyResponse, keyof SurveyResponse, 'submission'>>,
}

export class SurveySubmissionModel {
	public static create(data: SurveySubmissionCreatePayload, projection?: Projection) {
		return surveyClient.put('/surveys/submissions', data, {
			params: {
				p: projection,
			},
		});
	}

	protected static denormalize(submission: SurveySubmission): SurveySubmission {
		submission.submittedDate = parseApiTimestamp(submission.submittedDate);
		return submission;
	}
}
