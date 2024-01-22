import axios, {TypedAxiosInstance} from 'restyped-axios';
import {Config} from '../../config';
import {attachResponseHandlers} from '../errors/symfony';
import {QuestionEndpoints} from './Models/Questions';
import {QuestionTagEndpoints} from './Models/QuestionTags';
import {QuizEndpoints} from './Models/Quiz';
import {QuizSubmissionEndpoints} from './Models/QuizSubmissions';
import {SettingsEndpoints} from './Models/Settings';
import {UserEndpoints} from './Models/Users';

type Endpoints =
	QuestionEndpoints
	& QuizSubmissionEndpoints
	& UserEndpoints
	& SettingsEndpoints
	& QuestionTagEndpoints
	& QuizEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.quiz_url,
	});

	attachResponseHandlers(client);

	return client;
}
