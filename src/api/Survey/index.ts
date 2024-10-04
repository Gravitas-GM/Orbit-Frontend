import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {ucwords} from '../../utility/string';
import {attachResponseHandlers} from '../errors/symfony';
import {Entity} from '../index';
import {SettingsEndpoints} from './Models/Settings';
import {ChoiceResponse, FreeTextResponse, ScaleResponse, SurveyEndpoints} from './Models/Survey';
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

interface BaseQuestion<Summarized extends boolean = false> extends Entity {
	kind: QuestionKind,
	prompt: string,
	summary: Summarized extends true ? ResponseSummary : null,
}

export interface BaseFreeTextQuestion<Summarized extends boolean = false> extends BaseQuestion<Summarized> {
	kind: QuestionKind.FreeText,
	responses: FreeTextResponse[],
	summary: Summarized extends true ? FreeTextResponseSummary : null,
}

export interface BaseChoiceQuestion<Summarized extends boolean = false> extends BaseQuestion<Summarized> {
	kind: QuestionKind.Choice,
	choices: string[],
	responses: ChoiceResponse[],
	summary: Summarized extends true ? ChoiceResponseSummary : null,
}

export type ScaleQuestionLabels = { [key: string]: string };

export interface BaseScaleQuestion<Summarized extends boolean = false> extends BaseQuestion<Summarized> {
	kind: QuestionKind.Scale,
	startValue: number,
	endValue: number,
	stepAmount: number,
	labels: ScaleQuestionLabels | null,
	responses: ScaleResponse[],
	summary: Summarized extends true ? ScaleResponseSummary : null,
}

export type Question<Summarized extends boolean = false> =
	BaseFreeTextQuestion<Summarized>
	| BaseChoiceQuestion<Summarized>
	| BaseScaleQuestion<Summarized>;

interface BaseResponseSummary extends Entity {
	kind: QuestionKind,
	responseCount: number,
}

export interface ScaleResponseSummary extends BaseResponseSummary {
	min: number,
	max: number,
	average: number,
	median: number,
	mode: number,
	frequencies: { [key: number]: number },
}

export interface FreeTextResponseSummary extends BaseResponseSummary {
	frequencies: { [key: string]: number },
}

export interface ChoiceResponseSummary extends BaseResponseSummary {
	frequencies: { [key: number]: number },
}

export type ResponseSummary = ScaleResponseSummary | FreeTextResponseSummary | ChoiceResponseSummary;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.survey_url,
	});

	attachResponseHandlers(client);

	return client;
}
