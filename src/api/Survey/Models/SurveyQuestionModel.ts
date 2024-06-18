import {Id, Identity, Projectable, Projection, Stub, surveyClient} from '../../index';
import {BaseChoiceQuestion, BaseFreeTextQuestion, BaseScaleQuestion, Question} from '../index';
import {Survey} from './SurveyModel';

export interface SurveyQuestionEndpoints {
	'/surveys/next/questions/:id': {
		GET: {
			params: Identity,
			query: Projectable,
			response: SurveyQuestion,
		},

		DELETE: {
			params: Identity,
			response: void,
		},
	},
}

type WithSurvey<T extends Question> = T & {
	survey: Stub<Survey>,
};

export type SurveyFreeTextQuestion = WithSurvey<BaseFreeTextQuestion>;
export type SurveyChoiceQuestion = WithSurvey<BaseChoiceQuestion>;
export type SurveyScaleQuestion = WithSurvey<BaseScaleQuestion>;

export type SurveyQuestion = SurveyFreeTextQuestion | SurveyChoiceQuestion | SurveyScaleQuestion;

export class SurveyQuestionModel {
	public static readFromNext(id: Id, projection?: Projection) {
		return surveyClient.get<'/surveys/next/questions/:id'>(`/surveys/next/questions/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static deleteFromNext(id: Id) {
		return surveyClient.delete<'/surveys/next/questions/:id'>(`/surveys/next/questions/${id}`);
	}
}
