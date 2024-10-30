import {Create, Id, Identity, Projectable, Projection, Stub, surveyClient, Update} from '../../index';
import {BaseChoiceQuestion, BaseFreeTextQuestion, BaseScaleQuestion, Question} from '../index';
import {Survey} from './Survey';
import {ChoiceResponse, FreeTextResponse, ScaleResponse} from './SurveySubmission';

export interface SurveyQuestionEndpoints {
	'/surveys/next/questions': {
		PUT: {
			query: Projectable,
			body: SurveyQuestionCreatePayload,
			response: SurveyQuestion,
		},
	},

	'/surveys/next/questions/:id': {
		GET: {
			params: Identity,
			query: Projectable,
			response: SurveyQuestion,
		},

		PATCH: {
			params: Identity,
			query: Projectable,
			body: SurveyQuestionUpdatePayload,
			response: SurveyQuestion,
		},

		DELETE: {
			params: Identity,
			response: void,
		},
	},
}

type WithSurvey<T extends Question<any>> = T & {
	survey: Stub<Survey>,
};

export type SurveyFreeTextQuestion<Summarized extends boolean = false> = WithSurvey<BaseFreeTextQuestion<Summarized>>;
export type SurveyChoiceQuestion<Summarized extends boolean = false> = WithSurvey<BaseChoiceQuestion<Summarized>>;
export type SurveyScaleQuestion<Summarized extends boolean = false> = WithSurvey<BaseScaleQuestion<Summarized>>;

export type SurveyQuestion<Summarized extends boolean = false> =
	SurveyFreeTextQuestion<Summarized>
	| SurveyChoiceQuestion<Summarized>
	| SurveyScaleQuestion<Summarized>;

export type SurveyQuestionCreatePayload = Create<SurveyQuestion, keyof SurveyQuestion, 'survey'>;
export type SurveyQuestionUpdatePayload = Update<SurveyQuestion, 'survey'>;

export type AsResponse<T extends SurveyQuestion<any>> = T extends SurveyFreeTextQuestion ? FreeTextResponse :
	T extends SurveyChoiceQuestion ? ChoiceResponse :
		T extends SurveyScaleQuestion ? ScaleResponse : never;

export class SurveyQuestionModel {
	public static readFromNext(id: Id, projection?: Projection) {
		return surveyClient.get<'/surveys/next/questions/:id'>(`/surveys/next/questions/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static createInNext(payload: SurveyQuestionCreatePayload, projection?: Projection) {
		return surveyClient.put('/surveys/next/questions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static updateInNext(id: Id, payload: SurveyQuestionUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/surveys/next/questions/:id'>(`/surveys/next/questions/${id}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static deleteFromNext(id: Id) {
		return surveyClient.delete<'/surveys/next/questions/:id'>(`/surveys/next/questions/${id}`);
	}
}
