import {Projection, QueryDocument, Stub} from '../../index';
import {BaseChoiceQuestion, BaseFreeTextQuestion, BaseQuestion, BaseScaleQuestion} from '../index';
import {Survey} from './SurveyModel';

type WithSurvey<T extends BaseQuestion> = T & {
	survey: Stub<Survey>,
};

export type SurveyFreeTextQuestion = WithSurvey<BaseFreeTextQuestion>;
export type SurveyChoiceQuestion = WithSurvey<BaseChoiceQuestion>;
export type SurveyScaleQuestion = WithSurvey<BaseScaleQuestion>;

export type SurveyQuestion = SurveyFreeTextQuestion | SurveyChoiceQuestion | SurveyScaleQuestion;
