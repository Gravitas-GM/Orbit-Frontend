import {quizClient} from '../../index';
import {Question} from './Questions';
import {QuizSubmission, QuizSubmissionCreatePayload} from './QuizSubmissions';

export interface QuizEndpoints {
	'/quiz/start': {
		POST: {
			response: Quiz;
		};
	}

	'/quiz/finish': {
		POST: {
			body: QuizSubmissionCreatePayload;
			response: QuizSubmission;
		};
	}
}

export interface Quiz {
	questions: Question[],
}

export class QuizModel {
	public static start() {
		return quizClient.post('/quiz/start');
	}

	public static finish() {
		return quizClient.post('/quiz/finish');
	}
}
