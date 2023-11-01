import {parseApiTimestamp} from '../../../Components/Utility/date';
import {Projectable, Projection, quizClient} from '../../index';
import {QuestionKind} from './Questions';
import {QuizSubmission, QuizSubmissionModel} from './QuizSubmissions';

export interface QuizEndpoints {
	'/quiz/start': {
		POST: {
			response: Quiz;
		};
	};

	'/quiz/finish': {
		POST: {
			query: Projectable;
			body: QuizFinishPayload;
			response: QuizSubmission;
		};
	};
}

export interface Quiz {
	questions: QuestionPrompt[],
	startTimestamp: Date,
	endTimestamp: Date | null,
}

interface QuestionPromptBase {
	id: number,
	prompt: string,
	kind: QuestionKind,
}

export interface FreeTextQuestionPrompt extends QuestionPromptBase {
	kind: QuestionKind.FreeText,
}

export interface BooleanQuestionPrompt extends QuestionPromptBase {
	kind: QuestionKind.Boolean,
	trueLabel: string | null,
	falseLabel: string | null,
}

export interface MultipleChoiceQuestionPrompt extends QuestionPromptBase {
	kind: QuestionKind.MultipleChoice,
	choices: string[],
}

export type QuestionPrompt = FreeTextQuestionPrompt | BooleanQuestionPrompt | MultipleChoiceQuestionPrompt;

interface AnswerBase {
	id: number,
	kind: QuestionKind,
}

export interface FreeTextAnswer extends AnswerBase {
	kind: QuestionKind.FreeText,
	answer: string | null,
}

export interface BooleanAnswer extends AnswerBase {
	kind: QuestionKind.Boolean,
	answer: boolean | null,
}

export interface MultipleChoiceAnswer extends AnswerBase {
	kind: QuestionKind.MultipleChoice,
	answerIndex: number | null,
}

export type Answer = FreeTextAnswer | BooleanAnswer | MultipleChoiceAnswer;

export interface QuizFinishPayload {
	responses: Answer[],
}

export class QuizModel {
	public static async start() {
		const response = await quizClient.post('/quiz/start');
		response.data = QuizModel.denormalize(response.data);

		return response;
	}

	public static async finish(payload: QuizFinishPayload, projection?: Projection) {
		const response = await quizClient.post('/quiz/finish', payload, {
			params: {
				p: projection,
			},
		});

		response.data = QuizSubmissionModel.denormalize(response.data);

		return response;
	}

	private static denormalize(quiz: Quiz) {
		quiz.startTimestamp = parseApiTimestamp(quiz.startTimestamp);

		if (quiz.endTimestamp !== null)
			quiz.endTimestamp = parseApiTimestamp(quiz.endTimestamp);

		return quiz;
	}
}
