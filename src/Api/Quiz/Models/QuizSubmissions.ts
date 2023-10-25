import {parseApiTimestamp} from '../../../Components/Utility/date';
import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';
import {Settings} from './Settings';
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
	account: Pick<Settings, 'id'>,
	user: User,
	startTimestamp: Date,
	endTimestamp: Date,
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
	kind: QuestionKind.FreeText,
	answers: string[],
	response: string,
}

export interface BooleanResponse extends QuestionResponseBase {
	kind: QuestionKind.Boolean,
	answer: boolean,
	response: boolean,
	trueLabel: string,
	falseLabel: string,
}

export interface MultipleChoiceResponse extends QuestionResponseBase {
	kind: QuestionKind.MultipleChoice,
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
			response.data = response.data.map(QuizSubmissionModel.denormalize);

			return response;
		});
	}

	public static read(submission: Id, projection?: Projection) {
		return quizClient.get<'/submissions/:submission'>(`/submissions/${submission}`, {
			params: {
				p: projection,
			},
		}).then(response => {
			response.data = QuizSubmissionModel.denormalize(response.data);

			return response;
		});
	}

	public static denormalizeQuizSubmission(submission: QuizSubmission) {
		submission.startTimestamp = parseApiTimestamp(submission.startTimestamp);
		submission.endTimestamp = parseApiTimestamp(submission.endTimestamp);

		return submission;
	}
}
