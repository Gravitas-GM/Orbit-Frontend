import {hubApiClient} from '../..';

export interface AuthenticationEndpoints {
	'/auth': {
		POST: {
			body: LoginPayload;
			response: {
				token: string;
			};
		};
	};

	'/auth/refresh': {
		GET: {
			response: {
				token: string;
			};
		};
	};
}

export type LoginPayload = {
	username: string;
	password: string;
}

export class AuthenticationModel {
	public static login(payload: LoginPayload) {
		return hubApiClient.post('/auth', payload);
	}

	public static refreshAuth() {
		return hubApiClient.get('/auth/refresh');
	}
}
