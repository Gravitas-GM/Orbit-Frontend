import { QuestionKind } from "../../../../Api/Quiz/Models/Questions";
import {
	BooleanResponse,
	FreeTextResponse,
	MultipleChoiceResponse,
	QuestionResponse,
} from "../../../../Api/Quiz/Models/QuizSubmissions";
import { Icon } from "@blueprintjs/core";
import "./QuizHistory.scss";
import { IconSize } from "../../../../IconSize";
import SimpleBar from "simplebar-react";
interface IProps {
	questions: QuestionResponse[];
}
const QuestionSummaryMaxHeight = 260;

export const QuestionsSummary: React.FC<IProps> = ({ questions }) => {
	return (
		<SimpleBar style={{ maxHeight: QuestionSummaryMaxHeight }}>
			{questions.map((question) => (
				<RenderQuestion question={question} key={question.prompt} />
			))}
		</SimpleBar>
	);
};

const RenderQuestion: React.FC<{ question: QuestionResponse }> = ({ question }) => {
	switch (question.kind) {
		case QuestionKind.MultipleChoice:
			return <RenderMultipleChoice question={question} />;
		case QuestionKind.Boolean:
			return <RenderBoolean question={question} />;
		case QuestionKind.FreeText:
			return <RenderFreeText question={question} />;
		default:
			return null;
	}
};

const RenderMultipleChoice: React.FC<{ question: MultipleChoiceResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<span>{question.prompt}</span>
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
				<div className="question-details-card">
					<span>Result:</span>

					{question.correct ? (
						<Icon size={IconSize.LARGE} icon="tick" color="green" />
					) : (
						<Icon size={IconSize.LARGE} icon="delete" color="red" />
					)}
				</div>
			</div>
		</div>
	);
};

export const RenderBoolean: React.FC<{ question: BooleanResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<span>{question.prompt}</span>
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

				<div className="question-details-card">
					<span>Result:</span>

					{question.correct ? (
						<Icon size={IconSize.LARGE} icon="tick" color="green" />
					) : (
						<Icon size={IconSize.LARGE} icon="delete" color="red" />
					)}
				</div>
			</div>
		</div>
	);
};

export const RenderFreeText: React.FC<{ question: FreeTextResponse }> = ({ question }) => {
	return (
		<div className="question">
			<div className="question-title">
				<span>{question.prompt}</span>
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
				<div className="question-details-card">
					<span>Result:</span>

					{question.correct ? (
						<Icon size={IconSize.LARGE} icon="tick" color="green" />
					) : (
						<Icon size={IconSize.LARGE} icon="delete" color="red" />
					)}
				</div>
			</div>
		</div>
	);
};
