import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import { AccountEndpoints } from './Models/Accounts';
import {AuthenticationEndpoints} from './Models/Authentication';
import {UserActivationEndpoints} from './Models/UserActivation';
import { UserEndpoints } from './Models/Users';

type Endpoints = UserEndpoints & AccountEndpoints & AuthenticationEndpoints & UserActivationEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	return axios.create<Endpoints>({
		baseURL: Config.api.hub_url,
	});
}
