import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import { attachResponseHandlers } from '../errors/symfony';
import { BoardEndpoints } from './Models/Boards';
import { GameEndpoints } from './Models/Games';
import { StageEndpoints } from './Models/Stages';

type Endpoints = StageEndpoints & BoardEndpoints & GameEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	const client = axios.create<Endpoints>({
		baseURL: Config.api.game_catalog_url,
	});

	attachResponseHandlers(client);

	return client;
}
