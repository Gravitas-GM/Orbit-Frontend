import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {attachResponseHandlers} from '../errors/symfony';
import {Entity} from '../index';
import {SurveyBankEndpoints} from './Models/SurveyBankModel';
import {SurveyBankQuestionEndpoints} from './Models/SurveyBankQuestionModel';
import {SurveyEndpoints} from './Models/SurveyModel';

type Endpoints = SurveyBankEndpoints & SurveyEndpoints & SurveyBankQuestionEndpoints;

export enum QuestionKind {
	FreeText = 'free text',
	Choice = 'choice',
	Scale = 'scale',
}

export interface BaseQuestion extends Entity {
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

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.survey_url,
	});

	attachResponseHandlers(client);

	return client;
}
