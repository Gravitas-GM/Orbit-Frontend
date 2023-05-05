import {Id, Projectable, Projection, Queryable, QueryDocument, quizClient} from '../../index';
import {BooleanQuestion, FreeTextQuestion, MultipleChoiceQuestion} from './Questions';
import {User} from './Users';

export interface QuizSubmissionEndpoints {
	'/submissions': {
		GET: {
			query: Queryable & Projectable;
			response: QuizSubmission[];
		};

		PUT: {
			query: Projectable;
			body: QuizSubmissionCreatePayload;
			response: QuizSubmission;
		};
	};

	'/submissions/:submission': {
		GET: {
			params: Id;
			response: QuizSubmission;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};
}

export interface QuizSubmission {
	id: number,
	userId: User,
	timestamp: Date,
	correctCount: number,
	questions: QuestionResponse[],
}

class BaseQuestion {
}

interface BaseQuestionResponse extends Omit<BaseQuestion, 'tagId' | 'kind'> {
	correct: boolean,
}

export interface FreeTextResponse extends BaseQuestionResponse, Omit<FreeTextQuestion, 'tagId'> {
	response: string,
}

export interface BooleanResponse extends BaseQuestionResponse, Omit<BooleanQuestion, 'tagId'> {
	response: boolean,
}

export interface MultipleChoiceResponse extends BaseQuestionResponse, Omit<MultipleChoiceQuestion, 'tagId'> {
	response: number,
}

export type QuestionResponse = FreeTextResponse | BooleanResponse | MultipleChoiceResponse;

export type QuizSubmissionCreatePayload = Omit<QuizSubmission, 'id'>;

export class QuizSubmissionModel {
	public static list(projection?: Projection, query?: QueryDocument) {
		return quizClient.get('/submissions', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: QuizSubmissionCreatePayload, projection?: Projection) {
		return quizClient.put('/submissions', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(submission: Id) {
		return quizClient.get<'/submissions/:submission'>(`/submissions/${submission}`);
	}

	public static delete(submission: Id) {
		return quizClient.delete<'/submissions/:submission'>(`/submissions/${submission}`);
	}
}
