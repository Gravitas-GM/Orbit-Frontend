import { QuestionKind } from "../../../../Api/Quiz/Models/Questions";
import {
	BooleanResponse,
	FreeTextResponse,
	MultipleChoiceResponse,
	QuestionResponse,
} from "../../../../Api/Quiz/Models/QuizSubmissions";
import { Icon, Intent } from "@blueprintjs/core";
import "./QuizHistory.scss";
import { IconSize } from "../../../../IconSize";
import SimpleBar from "simplebar-react";
interface IProps {
	questions: QuestionResponse[];
}
const QuizResponsesMaxHeight = 260;

export const QuizResponses: React.FC<IProps> = ({ questions }) => {
	return (
		<SimpleBar style={{ maxHeight: QuizResponsesMaxHeight }}>
			{questions.map((question) => (
				<Response question={question} key={question.prompt} />
			))}
		</SimpleBar>
	);
};

const Response: React.FC<{ question: QuestionResponse }> = ({ question }) => {
	switch (question.kind) {
		case QuestionKind.MultipleChoice:
			return <MultipleChoiceAnswer question={question} />;
		case QuestionKind.Boolean:
			return <BooleanAnswer question={question} />;
		case QuestionKind.FreeText:
			return <FreeTextAnswer question={question} />;
		default:
			return null;
	}
};

const MultipleChoiceAnswer: React.FC<{ question: MultipleChoiceResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>
			<div className="question-details">
				<div className="question-details-card">
					<span>Given Answer:</span>

					{question.choices[question.response]}
				</div>
				<div className="question-details-card">
					<span>Correct Answer:</span>

					{question.choices[question.answerIndex]}
				</div>

				<QuestionResult correct={question.correct}/>
			</div>
		</div>
	);
};

export const BooleanAnswer: React.FC<{ question: BooleanResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>

			<div className="question-details">
				<div className="question-details-card">
					<span>Given Answer:</span>

					{question.response ? question.trueLabel : question.falseLabel}
				</div>

				<div className="question-details-card">
					<span>Correct Answer:</span>

					{question.answer ? question.trueLabel : question.falseLabel}
				</div>

				<QuestionResult correct={question.correct}/>
			</div>
		</div>
	);
};

export const FreeTextAnswer: React.FC<{ question: FreeTextResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} /> <span>{question.prompt}</span>
			</div>

			<div className="question-details">
				<div className="question-details-card">
					<span>Given Answer:</span>

					{question.response}
				</div>

				<div className="question-details-card">
					<span>Correct Answers:</span>

					{question.answers.join(", ")}
				</div>

				<QuestionResult correct={question.correct} />
			</div>
		</div>
	);
};

const QuestionResult: React.FC<{ correct: boolean }> = ({ correct }) => {
	return (
		<div className="question-details-card">
			<span>Result:</span>

			{correct ? (
				<Icon size={IconSize.LARGE} icon="tick-circle" intent={Intent.SUCCESS} />
			) : (
				<Icon size={IconSize.LARGE} icon="delete" intent={Intent.DANGER} />
			)}
		</div>
	);
};
