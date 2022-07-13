import axios, { TypedAxiosInstance } from 'restyped-axios';
import {GamesEndpoints} from './Models/Games';

type Endpoints = GamesEndpoints;

export function init(): TypedAxiosInstance<Endpoints> {
	return axios.create<Endpoints>({
		baseURL: process.env.GAME_STATE_URL ?? 'https://gamestate.api.happyorbit.com',
	});
}
