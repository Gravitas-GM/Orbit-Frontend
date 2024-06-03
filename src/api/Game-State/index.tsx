import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import { attachResponseHandlers } from '../errors/rocket';
import { GamesEndpoints } from './Models/Games';
import { HistoryEndpoints } from './Models/History';

type Endpoints = GamesEndpoints & HistoryEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.game_state_url,
	});

	attachResponseHandlers(client);

	return client;
}
