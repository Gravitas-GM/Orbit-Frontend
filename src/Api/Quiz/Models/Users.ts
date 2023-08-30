import {Id, quizClient} from '../../index';
import {QuestionTag} from './QuestionTags';
import {QuizSubmission} from './QuizSubmissions';

export interface UserEndpoints {
	'/users/:id': {
		GET: {
			params: Id;
			response: User;
		};
	};

	'/users/me': {
		GET: {
			response: User;
		}
	};

	'/users/me/submissions': {
		GET: {
			response: QuizSubmission[];
		}
	};
}

export interface User {
	id: number,
	name: string,
	nextQuizTimestamp: Date,
	assignedTags: QuestionTag[],
}

export class UserModel {
	public static read(user: Id) {
		return quizClient.get<'/users/:id'>(`/users/${user}`);
	}

	public static getCurrentUser() {
		return quizClient.get('/users/me');
	}

	public static getSubmissions() {
		return quizClient.get('/users/me/submissions');
	}
}
