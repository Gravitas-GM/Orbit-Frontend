import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {ucwords} from '../../utility/string';
import {attachResponseHandlers} from '../errors/symfony';
import {Entity} from '../index';
import {SurveyBankEndpoints} from './Models/SurveyBankModel';
import {SurveyBankQuestionEndpoints} from './Models/SurveyBankQuestionModel';
import {SurveyEndpoints} from './Models/SurveyModel';
import {SurveyQuestionEndpoints} from './Models/SurveyQuestionModel';

type Endpoints = SurveyBankEndpoints & SurveyEndpoints & SurveyBankQuestionEndpoints & SurveyQuestionEndpoints;

export enum QuestionKind {
	FreeText = 'free text',
	Choice = 'choice',
	Scale = 'scale',
}

export function getKindDisplayName(kind: QuestionKind): string {
	return ucwords(kind);
}

interface BaseQuestion extends Entity {
	kind: QuestionKind,
	prompt: string,
}

export interface BaseFreeTextQuestion extends BaseQuestion {
	kind: QuestionKind.FreeText,
}

export interface BaseChoiceQuestion extends BaseQuestion {
	kind: QuestionKind.Choice,
	choices: string[],
}

export interface BaseScaleQuestion extends BaseQuestion {
	kind: QuestionKind.Scale,
	startValue: number,
	endValue: number,
	stepAmount: number,
}

export type Question = BaseFreeTextQuestion | BaseChoiceQuestion | BaseScaleQuestion;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.survey_url,
	});

	attachResponseHandlers(client);

	return client;
}
