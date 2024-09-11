import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {ucwords} from '../../utility/string';
import {attachResponseHandlers} from '../errors/symfony';
import {Entity} from '../index';
import {SettingsEndpoints} from './Models/Settings';
import {SurveyEndpoints} from './Models/Survey';
import {SurveyBankEndpoints} from './Models/SurveyBank';
import {SurveyBankQuestionEndpoints} from './Models/SurveyBankQuestion';
import {SurveyQuestionEndpoints} from './Models/SurveyQuestion';
import {SurveySubmissionEndpoints} from './Models/SurveySubmission';

type Endpoints = SurveyBankEndpoints
	& SurveyEndpoints
	& SurveyBankQuestionEndpoints
	& SurveyQuestionEndpoints
	& SettingsEndpoints
	& SurveySubmissionEndpoints;

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

export type ScaleQuestionLabels = {[key: string]: string};

export interface BaseScaleQuestion extends BaseQuestion {
	kind: QuestionKind.Scale,
	startValue: number,
	endValue: number,
	stepAmount: number,
	labels: ScaleQuestionLabels | null,
}

export type Question = BaseFreeTextQuestion | BaseChoiceQuestion | BaseScaleQuestion;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.survey_url,
	});

	attachResponseHandlers(client);

	return client;
}
