import {hubApiClient} from '../..';

export interface AuthenticationEndpoints {
	'/auth': {
		POST: {
			response: void;
		};
	};

	'/auth/refresh': {
		GET: {
			response: void;
		};
	};
}

export class AuthenticationApi {
	public static auth() {
		return hubApiClient.post('/auth');
	}

	public static refreshAuth() {
		return hubApiClient.get('/auth/refresh');
	}
}
