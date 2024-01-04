import {Department} from '../../Hub/Models/Departments';
import {Entity, Id, Projection, Stub, surveyClient} from '../../index';

export interface UserEndpoints {
	'/users/:user': {
		GET: {
			params: Id;
			response: User;
		};
	};
}

export interface User extends Entity {
	department: Stub<Department, 'id' | 'name'>;
	surveySubmitted: boolean;
}

export class UserModel {
	public static read(user: Id, projection?: Projection) {
		return surveyClient.get<'/users/:user'>(`/users/${user}`, {
			params: {
				p: projection,
			},
		});
	}
}
