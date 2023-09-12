import {parseApiTimestamp} from '../../../Components/Utility/date';
import {Id, quizClient} from '../../index';
import {QuestionTag} from './QuestionTags';
import {QuizSubmission, QuizSubmissionModel} from './QuizSubmissions';

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
		return quizClient.get<'/users/:id'>(`/users/${user}`).then(response => {
			response.data = UserModel.denormalizeUser(response.data);

			return response;
		});
	}

	public static getCurrentUser() {
		return quizClient.get('/users/me').then(response => {
			response.data = UserModel.denormalizeUser(response.data);

			return response;
		});
	}

	public static getCurrentUsersSubmissions() {
		return quizClient.get('/users/me/submissions').then(response => {
			response.data = response.data.map(QuizSubmissionModel.denormalizeQuizSubmission);

			return response;
		});
	}

	private static denormalizeUser(user: User) {
		user.nextQuizTimestamp = parseApiTimestamp(user.nextQuizTimestamp);

		return user;
	}
}
