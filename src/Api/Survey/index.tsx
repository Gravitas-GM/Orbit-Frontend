import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {attachResponseHandlers} from '../errors/symfony';
import {DepartmentEndpoints} from './Models/Departments';
import {SettingsEndpoints} from './Models/Settings';
import {SurveyEndpoints} from './Models/Survey';
import {SurveyBankEndpoints} from './Models/SurveyBank';

type Endpoints = SurveyBankEndpoints & SurveyEndpoints & SettingsEndpoints & DepartmentEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.survey_url,
	});

	attachResponseHandlers(client);

	return client;
}
