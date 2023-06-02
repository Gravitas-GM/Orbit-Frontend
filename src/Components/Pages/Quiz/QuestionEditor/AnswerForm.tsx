import { H3, InputGroup, Button, Icon, Radio, Intent } from "@blueprintjs/core";
import { useContext, useState, useEffect, useCallback } from "react";
import { QuestionKind, QuestionCreatePayload, Question } from "../../../../Api/Quiz/Models/Questions";
import { UserContext } from "../../../../Session";
import { Spacing } from "../../../../Styles/variables";
import { QuestionTag } from "../../../../Api/Quiz/Models/QuestionTags";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";

interface IAnswerFormProps {
	prompt?: string;
	kind?: QuestionKind;
	tag?: QuestionTag;
	answers: string[];
	answerIndex?: number;
	failures: ValidationFailures | null;
	addAnswer: () => void;
	removeAnswer: (index: number) => void;
	saveQuestion: (question: QuestionCreatePayload) => Promise<Question | undefined>;
}

export const AnswerForm: React.FC<IAnswerFormProps> = ({
	prompt,
	kind,
	tag,
	answers,
	answerIndex,
	failures,
	addAnswer,
	removeAnswer,
	saveQuestion,
}) => {
	const User = useContext(UserContext);

	// base question related
	const [currentKind, setCurrentKind] = useState<QuestionKind | undefined>(kind);
	const [currentPrompt, setCurrentPrompt] = useState(prompt);
	const [currentTag, setCurrentTag] = useState<QuestionTag | undefined>(tag);

	// free text kind
	const [currentAnswers, setCurrentAnswers] = useState<string[]>(answers);

	// multiple choice kind
	const [currentChoices, setCurrentChoices] = useState<string[]>(answers);
	const [currentAnswerIndex, setCurrentAnswerIndex] = useState<number | undefined>(answerIndex);

	// boolean kind
	const [currentAnswer, setCurrentAnswer] = useState<boolean>();
	const [currentTrueLabel, setCurrentTrueLabel] = useState<string>();
	const [currentFalseLabel, setCurrentFalseLabel] = useState<string>();

	// failures
	const [validationFailures, setValidationFailures] = useState<ValidationFailures | null>(null);

	useEffect(() => {
		setCurrentAnswerIndex(answerIndex);
		setCurrentAnswers(answers);
		setCurrentChoices(answers);
		setCurrentPrompt(prompt);
		setCurrentKind(kind);
		setCurrentTag(tag);
		setValidationFailures(failures);
	}, [answerIndex, answers, prompt, kind, tag, failures]);

	const setBooleanLabel = useCallback((index: number, label: string) => {
		if (index === 0) {
			setCurrentTrueLabel(label);
		} else {
			setCurrentFalseLabel(label);
		}
	}, []);

	const setBooleanAnswer = useCallback((index: number) => {
		if (index === 0) {
			setCurrentAnswer(true);
		} else {
			setCurrentAnswer(false);
		}
	}, []);

	const saveQuestionCallback = useCallback(async () => {
		const accountId = User!.id;
		const tagId = currentTag!.id as number;

		// switch by kind and create question object
		switch (kind) {
			case QuestionKind.FreeText:
				const freeTextQuestion = {
					prompt: currentPrompt!,
					kind: currentKind!,
					answers: currentAnswers,
					accountId,
					tagId,
				};

				await saveQuestion(freeTextQuestion);

				break;

			case QuestionKind.Boolean:
				const booleanQuestion = {
					prompt: currentPrompt!,
					kind: currentKind!,
					answer: currentAnswer!,
					trueLabel: currentTrueLabel!,
					falseLabel: currentFalseLabel!,
					accountId,
					tagId,
				};

				await saveQuestion(booleanQuestion);

				break;

			case QuestionKind.MultipleChoice:
				const multipleChoiceQuestion = {
					prompt: currentPrompt!,
					kind: currentKind!,
					answerIndex: currentAnswerIndex!,
					choices: currentChoices,
					accountId,
					tagId,
				};

				await saveQuestion(multipleChoiceQuestion);

				break;

			default:
				break;
		}
	}, [
		currentKind,
		currentAnswer,
		currentAnswer,
		currentAnswerIndex,
		currentChoices,
		currentPrompt,
		currentTrueLabel,
		validationFailures,
		currentFalseLabel,
		currentAnswers,
		currentTag,
		kind,
		failures,
		saveQuestion,
	]);

	if (!kind || !tag)
		return null;

	return (
		<>
			{kind === QuestionKind.FreeText && (
				<div>
					<H3>Free Text Alternatives</H3>

					{currentAnswers.map((answer, index) => (
						<ValidationAwareFormGroup
							labelFor={`answer-${index}`}
							failures={validationFailures}
							key={answer}
							style={{ display: "grid", gridTemplateColumns: "3fr,2fr" }}
						>
							<div
								style={{
									display: "flex",
									gap: Spacing.m,
									width: "100%",
									alignItems: "center",
									marginBottom: Spacing.xl,
								}}
							>
								<InputGroup
									id={`answer-${index}`}
									name={`answer-${index}`}
									type="text"
									placeholder={"Answer"}
									defaultValue={answer}
									large={true}
									style={{ width: "100%" }}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setCurrentAnswers((answers) => {
											answers[index] = e.target.value;
											return answers;
										});
									}}
								/>

								<Button icon="remove" minimal onClick={() => removeAnswer(index)} />
							</div>
						</ValidationAwareFormGroup>
					))}

					<Button text="Add Answer" icon="plus" onClick={addAnswer} />
				</div>
			)}

			{kind === QuestionKind.Boolean && (
				<div>
					<H3>Boolean Labels</H3>

					{currentAnswers.map((answer, index) => (
						<div key={answer} style={{ display: "grid", gridTemplateColumns: "3fr,2fr", marginBottom: Spacing.xl }}>
							<div
								style={{
									display: "flex",
									gap: Spacing.m,
									width: "100%",
									alignItems: "center",
									marginBottom: Spacing.m,
								}}
							>
								<Icon icon={index === 0 ? "confirm" : "cross"} />

								<ValidationAwareFormGroup labelFor={`boolean-label-${index}`} failures={validationFailures}>
									<InputGroup
										id={`boolean-label-${index}`}
										type="text"
										placeholder={answer}
										large={true}
										style={{ width: "100%" }}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											setBooleanLabel(index, e.target.value);
										}}
									/>
								</ValidationAwareFormGroup>

								<ValidationAwareFormGroup labelFor="correct-answer" failures={validationFailures}>
									<Radio
										id="correct-answer"
										label="Correct Answer"
										checked={index === 0 ? currentAnswer === true : currentAnswer === false}
										onChange={() => setBooleanAnswer(index)}
									/>
								</ValidationAwareFormGroup>
							</div>
						</div>
					))}
				</div>
			)}

			{kind === QuestionKind.MultipleChoice && (
				<div>
					<H3>Multiple Choice Options</H3>

					{currentChoices.map((answer, index) => (
						<div key={answer} style={{ display: "grid", gridTemplateColumns: "3fr,2fr", marginBottom: Spacing.xl }}>
							<div
								style={{
									display: "flex",
									gap: Spacing.m,
									width: "100%",
									alignItems: "center",
									marginBottom: Spacing.m,
								}}
							>
								<ValidationAwareFormGroup labelFor={`answer-${index}`} failures={validationFailures}>
									<InputGroup
										id={`answer-${index}`}
										type="text"
										placeholder={"Answer"}
										defaultValue={answer}
										large={true}
										style={{ width: "100%" }}
									/>
								</ValidationAwareFormGroup>

								<Button icon="remove" minimal onClick={() => removeAnswer(index)} />
							</div>

							<ValidationAwareFormGroup labelFor="correct_answer" failures={validationFailures}>
								<Radio
									id="correct_answer"
									label="Correct Answer"
									checked={index === currentAnswerIndex}
									onChange={() => setCurrentAnswerIndex(index)}
								/>
							</ValidationAwareFormGroup>
						</div>
					))}

					<Button text="Add Answer" icon="plus" onClick={addAnswer} />
				</div>
			)}

			<hr style={{ marginTop: Spacing.xl, marginBottom: Spacing.xl, opacity: "0.3" }} />

			<Button
				large={true}
				intent={Intent.PRIMARY}
				text="Save Question"
				icon="floppy-disk"
				onClick={saveQuestionCallback}
			/>
		</>
	);
};
