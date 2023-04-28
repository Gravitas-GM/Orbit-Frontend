import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import { attachResponseHandlers } from '../errors/symfony';
import {QuestionEndpoints} from './Models/Questions';
import {QuestionTagEndpoints} from './Models/QuestionTags';
import {QuizSubmissionEndpoints} from './Models/QuizSubmissions';
import {AccountsEndpoints} from './Models/Accounts';
import {UserEndpoints} from './Models/Users';

type Endpoints = QuestionEndpoints & QuizSubmissionEndpoints & UserEndpoints & AccountsEndpoints & QuestionTagEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.quiz_url,
	});

	attachResponseHandlers(client);

	return client;
}
