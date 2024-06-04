import {Entity, Stub} from '../../index';
import {BaseChoiceQuestion, BaseFreeTextQuestion, BaseQuestion, BaseScaleQuestion} from '../index';
import {BankSurvey} from './SurveyBankModel';

type WithBankSurvey<T extends BaseQuestion> = T & {
	survey: Stub<BankSurvey>,
};

export type BankFreeTextQuestion = WithBankSurvey<BaseFreeTextQuestion>;
export type BankChoiceQuestion = WithBankSurvey<BaseChoiceQuestion>;
export type BankScaleQuestion = WithBankSurvey<BaseScaleQuestion>;

export type BankQuestion = BankFreeTextQuestion | BankChoiceQuestion | BankScaleQuestion;
