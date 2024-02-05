import {hubApiClient} from '../../index';

export interface PasswordResetEndpoints {
	'/public/users/password/request-reset': {
		POST: {
			body: RequestResetPayload;
			response: void;
		};
	};

	'/users/password/reset': {
		POST: {
			body: ResetPayload;
			response: void;
		};
	};
}

export type RequestResetPayload = {
	userEmailAddress: string;
	resetUrlTemplate: string;
};

export type ResetPayload = {
	password: string;
};

export class PasswordResetModel {
	public static requestReset(payload: RequestResetPayload) {
		return hubApiClient.post('/public/users/password/request-reset', payload);
	}

	public static reset(payload: ResetPayload) {
		return hubApiClient.post('/users/password/reset', payload);
	}
}
