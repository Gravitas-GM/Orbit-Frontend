import {hubApiClient} from '../../index';

export interface UserActivationEndpoints {
	'/public/users/activation/start': {
		POST: {
			body: UserActivationStartPayload;
			response: void;
		};
	};

	'/users/activation/activate': {
		POST: {
			body: UserActivatePayload;
			response: void;
		};
	};
}

export type UserActivationStartPayload = {
	userEmailAddress: string;
	activationUrlTemplate: string;
};

export type UserActivatePayload = {
	password: string;
};

export class UserActivationModel {
	public static startActivation(payload: UserActivationStartPayload) {
		return hubApiClient.post('/public/users/activation/start', payload);
	}

	public static activate(payload: UserActivatePayload, token: string) {
		return hubApiClient.post(
			'/users/activation/activate',
			payload,
			{headers: {'Authorization': `Bearer ${token}`}},
		);
	}
}
