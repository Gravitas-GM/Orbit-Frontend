import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {attachResponseHandlers} from '../errors/symfony';
import {BankQuestionEndpoints} from './Models/BankQuestions';
import {SurveyBankEndpoints} from './Models/BankSurveys';
import {SettingsEndpoints} from './Models/Settings';
import {SurveyEndpoints} from './Models/Surveys';
import {SurveyQuestionEndpoints} from './Models/SurveyQuestions';
import {UserEndpoints} from './Models/Users';

type Endpoints =
	SurveyBankEndpoints
	& SurveyEndpoints
	& SettingsEndpoints
	& UserEndpoints
	& BankQuestionEndpoints
	& SurveyQuestionEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.survey_url,
	});

	attachResponseHandlers(client);

	return client;
}
