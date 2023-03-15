import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import { attachResponseHandlers } from '../errors/symfony';
import { AccountEndpoints } from './Models/Accounts';
import { AuthenticationEndpoints } from './Models/Authentication';
import { UserActivationEndpoints } from './Models/UserActivation';
import { UserEndpoints } from './Models/Users';

type Endpoints = UserEndpoints & AccountEndpoints & AuthenticationEndpoints & UserActivationEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.hub_url,
	});

	attachResponseHandlers(client);

	return client;
}
