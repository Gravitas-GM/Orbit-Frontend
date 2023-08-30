import {parseApiTimestamp} from '../../../Components/Utility/date';
import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';
import {QuestionKind} from './Questions';
import {User} from './Users';

export interface QuizSubmissionEndpoints {
	'/submissions': {
		GET: {
			query: Queryable & Projectable;
			response: QuizSubmission[];
		};
	};

	'/submissions/:submission': {
		GET: {
			params: Id;
			response: QuizSubmission;
		};
	};
}

export interface QuizSubmission {
	id: number,
	account: {
		id: Id,
	},
	user: User,
	timestamp: Date,
	questionCount: number,
	correctCount: number,
	questions: QuestionResponse[],
}

interface QuestionResponseBase {
	correct: boolean,
	prompt: string,
	kind: QuestionKind,
}

export interface FreeTextResponse extends QuestionResponseBase {
	answers: string[],
	response: string,
}

export interface BooleanResponse extends QuestionResponseBase {
	answer: boolean,
	response: boolean,
	trueLabel: string,
	falseLabel: string,
}

export interface MultipleChoiceResponse extends QuestionResponseBase {
	choices: string[],
	answerIndex: number,
	response: number,
}

export type QuestionResponse = FreeTextResponse | BooleanResponse | MultipleChoiceResponse;

export class QuizSubmissionModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/submissions', {
			params: {
				p: projection,
				q: query,
			},
		}).then(response => {
			response.data = response.data.map(QuizSubmissionModel.denormalizeQuizSubmission);

			return response;
		});
	}

	public static read(submission: Id) {
		return quizClient.get<'/submissions/:submission'>(`/submissions/${submission}`).then(response => {
			response.data = QuizSubmissionModel.denormalizeQuizSubmission(response.data);

			return response;
		});
	}

	public static denormalizeQuizSubmission(submission: QuizSubmission) {
		submission.timestamp = parseApiTimestamp(submission.timestamp);

		return submission;
	}
}
