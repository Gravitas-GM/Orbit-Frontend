import {ApiError, isApiErrorResponse, isAxiosErrorResponse} from './errors';
import * as hubApi from "./Hub";
import {AuthenticationModel} from './Hub/Models/Authentication';
import {Token, TokenStorage} from './jwt';
import * as pointTrackingApi from "./Point-Tracking";
import {history} from '../history';

export interface QueryDocument {
	[key: string]: string | number | boolean | null | Array<any> | QueryDocument | QueryDocument[];
}

export type Projection = { [key: string]: true } | { [key: string]: false };

export type Queryable = {
	q?: QueryDocument;
};

export type Projectable = {
	p?: Projection;
};

export const hubApiClient = hubApi.init();
export const pointTrackingClient = pointTrackingApi.init();

export const tokenStorage = new TokenStorage();
tokenStorage.initialize();

export async function login(username: string, password: string) {
	const response = await AuthenticationModel.login({
		username,
		password
	}).then(response => response.data);

	tokenStorage.setToken(new Token(response.token));
}

export function logout() {
	tokenStorage.setToken(null);

	history.push(history.location.pathname);
}

export function isAuthenticated() {
	return tokenStorage.getToken()?.isValid();
}

hubApiClient.interceptors.response.use(response => {
	if (isApiErrorResponse(response.data)) {
		const error = response.data.error;

		throw new ApiError(error.code, error.message, error.context ?? {}, error.exceptions);
	}

	return response;
}, error => {
	if (!isAxiosErrorResponse(error) || !error.response || !isApiErrorResponse(error.response.data))
		throw error;

	const data = error.response.data.error;

	throw new ApiError(data.code, data.message, data.context ?? {}, data.exceptions);
});
