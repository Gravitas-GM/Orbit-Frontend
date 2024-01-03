import {Department} from '../../Hub/Models/Departments';
import {Id, Projectable, Projection, surveyClient} from '../../index';

export interface UserEndpoints {
	'/users/:user': {
		GET: {
			params: Id;
			response: User;
		};

		PATCH: {
			query: Projectable;
			params: Id;
			body: UserUpdatePayload;
			response: User;
		};
	};
}

export interface User {
	id: Id;
	department: Pick<Department, 'id' | 'name'>;
	surveySubmitted: boolean;
}

export type UserUpdatePayload = Partial<Omit<User, 'id' | 'department'> & {
	department?: number | null;
}>;

export class UserModel {
	public static read(user: Id, projection?: Projection) {
		return surveyClient.get<'/users/:user'>(`/users/${user}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(user: Id, payload: UserUpdatePayload, projection?: Projection) {
		return surveyClient.patch<'/users/:user'>(`/users/${user}`, payload, {
			params: {
				p: projection,
			},
		});
	}
}
