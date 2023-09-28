import {parseApiTimestamp} from '../../../Components/Utility/date';
import {quizClient} from '../../index';
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
	response: string,
}

export interface BooleanAnswer extends AnswerBase {
	kind: QuestionKind.Boolean,
	response: boolean,
}

export interface MultipleChoiceAnswer extends AnswerBase {
	kind: QuestionKind.MultipleChoice,
	response: number,
}

export type Answer = FreeTextAnswer | BooleanAnswer | MultipleChoiceAnswer;

export interface QuizFinishPayload {
	answers: Answer[],
}

export class QuizModel {
	public static start() {
		return quizClient.post('/quiz/start').then(response => {
			response.data = QuizModel.denormalizeQuiz(response.data);

			return response;
		});
	}

	public static finish(payload: QuizFinishPayload) {
		return quizClient.post('/quiz/finish', payload).then(response => {
			response.data = QuizSubmissionModel.denormalizeQuizSubmission(response.data);

			return response;
		});
	}

	private static denormalizeQuiz(quiz: Quiz) {
		quiz.startTimestamp = parseApiTimestamp(quiz.startTimestamp);

		if (quiz.endTimestamp !== null)
			quiz.endTimestamp = parseApiTimestamp(quiz.endTimestamp);

		return quiz;
	}
}
