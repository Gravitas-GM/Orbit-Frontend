import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Config } from '../../config';
import { PointsEndpoints } from './Models/Points';
import { PointSourceEndpoints } from './Models/Sources';

type Endpoints = PointsEndpoints & PointSourceEndpoints;

export interface ObjectId {
	$oid: string;
}

export function init(): TypedAxiosInstance<Endpoints> {
	return axios.create<Endpoints>({
		baseURL: Config.api.point_tracking_url,
	});
}
