import axios, { TypedAxiosInstance } from 'restyped-axios';
import { AccountEndpoints } from './models/Accounts';
import { UserEndpoints } from './models/Users';

type Endpoints = UserEndpoints & AccountEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	return axios.create<Endpoints>({
		baseURL: process.env.HUB_URL ?? 'https://hub.api.happyorbit.com',
	});
}
