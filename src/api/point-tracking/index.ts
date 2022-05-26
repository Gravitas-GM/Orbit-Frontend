import axios, { TypedAxiosInstance } from 'restyped-axios';
import { PointsEndpoints } from './models/Points';
import { PointSourceEndpoints } from './models/Sources';

type Endpoints = PointsEndpoints & PointSourceEndpoints;

export interface ObjectId {
	$oid: string;
}

export function init(): TypedAxiosInstance<Endpoints> {
	return axios.create<Endpoints>({
		baseURL: process.env.POINT_TRACKING_URL ?? 'https://points.api.happyorbit.com',
	});
}
