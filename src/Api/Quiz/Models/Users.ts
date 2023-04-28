import {Id, Projectable, Projection, quizClient} from '../../index';
import {QuestionTag} from './QuestionTags';

export interface UserEndpoints {
	'/users': {
		PUT: {
			query: Projectable;
			body: UserCreatePayload;
			response: User;
		};
	};

	'/users/:id': {
		GET: {
			params: Id;
			response: User;
		};

		PATCH: {
			params: Id;
			body: UserUpdatePayload;
			response: User;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

export interface User {
	id: number,
	name: string,
	nextQuizTimestamp: Date,
	assignedTags: QuestionTag[],
}

export type UserCreatePayload = Omit<User, 'id'>;

export type UserUpdatePayload = Partial<Omit<User, 'id'>>;

export class UserModel {
	public static create(payload: UserCreatePayload, projection?: Projection) {
		return quizClient.put('/users', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(user: Id) {
		return quizClient.get<'/users/:id'>(`/users/${user}`);
	}

	public static update(user: Id, payload: UserUpdatePayload) {
		return quizClient.patch<'/users/:id'>(`/users/${user}`, payload);
	}

	public static delete(user: Id) {
		return quizClient.delete<'/users/:id'>(`/users/${user}`);
	}
}
