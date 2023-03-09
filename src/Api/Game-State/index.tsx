import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import {GamesEndpoints} from './Models/Games';
import {HistoryEndpoints} from './Models/History';

type Endpoints = GamesEndpoints & HistoryEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	return axios.create<Endpoints>({
		baseURL: Config.api.game_state_url,
	});
}
