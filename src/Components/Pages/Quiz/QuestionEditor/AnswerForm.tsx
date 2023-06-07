import { H3, InputGroup, Button, Icon, Radio, Intent } from "@blueprintjs/core";
import React from "react";
import { QuestionKind, QuestionCreatePayload, Question } from "../../../../Api/Quiz/Models/Questions";
import { UserContext } from "../../../../Session";
import { Spacing } from "../../../../Styles/variables";
import { QuestionTag } from "../../../../Api/Quiz/Models/QuestionTags";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../Api/errors/symfony";

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

interface IAnswerFormState {
	currentKind: QuestionKind | undefined;
	currentPrompt: string | undefined;
	currentTag: QuestionTag | undefined;
	currentAnswers: string[];
	currentChoices: string[];
	currentAnswerIndex: number | undefined;
	currentAnswer: boolean | undefined;
	currentTrueLabel: string | undefined;
	currentFalseLabel: string | undefined;
	validationFailures: ValidationFailures | null;
}

export class AnswerForm extends React.PureComponent<IAnswerFormProps, IAnswerFormState> {
	public state: Readonly<IAnswerFormState> = {
		currentKind: this.props.kind,
		currentPrompt: this.props.prompt,
		currentTag: this.props.tag,
		currentAnswers: this.props.answers,
		currentChoices: this.props.answers,
		currentAnswerIndex: this.props.answerIndex,
		currentAnswer: undefined,
		currentTrueLabel: undefined,
		currentFalseLabel: undefined,
		validationFailures: this.props.failures,
	};

	public componentDidUpdate(prevProps: Readonly<IAnswerFormProps>): void {
		if (prevProps.kind !== this.props.kind)
			this.setState({ currentKind: this.props.kind });
		if (prevProps.prompt !== this.props.prompt)
			this.setState({ currentPrompt: this.props.prompt });
		if (prevProps.tag !== this.props.tag)
			this.setState({ currentTag: this.props.tag });
		if (prevProps.answers !== this.props.answers)
			this.setState({ currentAnswers: this.props.answers });
		if (prevProps.answerIndex !== this.props.answerIndex)
			this.setState({ currentAnswerIndex: this.props.answerIndex });
		if (prevProps.failures !== this.props.failures)
			this.setState({ validationFailures: this.props.failures });
		if (prevProps.answers !== this.props.answers)
			this.setState({ currentChoices: this.props.answers });
	};

	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public render() {
		if (!this.props.kind || !this.props.tag)
			return null;

		return (
			<>
				{this.props.kind === QuestionKind.FreeText && (
					<div>
						<H3>Free Text Alternatives</H3>

						{this.state.currentAnswers.map((answer, index) => {
							return (
								<ValidationAwareFormGroup
									labelFor={`answer-${index}`}
									failures={this.state.validationFailures}
									key={answer}
									style={{ display: "grid", gridTemplateColumns: "3fr,2fr" }}
								>
									<div
										style={{
											display: "flex",
											gap: Spacing.Medium,
											width: "100%",
											alignItems: "center",
										}}
									>
										<InputGroup
											id={`answer-${index}`}
											name={`answer-${index}`}
											type="text"
											defaultValue={answer}
											large={true}
											style={{ width: "100%" }}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												this.setState(({currentAnswers}) =>
													{
														currentAnswers[index] = e.target.value;
													}
												)
											}}
										/>

										<Button icon="remove" minimal onClick={() => this.props.removeAnswer(index)} />
									</div>
								</ValidationAwareFormGroup>
							)}
						)}

						<Button style={{ marginTop: Spacing.Medium }}text="Add Answer" icon="plus" onClick={this.props.addAnswer} />
					</div>
				)}

				{this.props.kind === QuestionKind.Boolean && (
					<div>
						<H3>Boolean Labels</H3>

						{this.state.currentAnswers.map((answer, index) => (
							<div key={answer} style={{ display: "grid", gridTemplateColumns: "3fr,2fr", marginBottom: Spacing.xl }}>
								<div
									style={{
										display: "flex",
										gap: Spacing.Medium,
										width: "100%",
										alignItems: "center",
										marginBottom: Spacing.Medium,
									}}
								>
									<Icon icon={index === 0 ? "confirm" : "cross"} />

									<ValidationAwareFormGroup labelFor={`boolean-label-${index}`} failures={this.state.validationFailures}>
										<InputGroup
											id={`boolean-label-${index}`}
											type="text"
											placeholder={answer}
											large={true}
											style={{ width: "100%" }}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												this.setBooleanLabel(index, e.target.value);
											}}
										/>
									</ValidationAwareFormGroup>

									<ValidationAwareFormGroup labelFor="correct-answer" failures={this.state.validationFailures}>
										<Radio
											id="correct-answer"
											label="Correct Answer"
											checked={index === 0 ? this.state.currentAnswer === true : this.state.currentAnswer === false}
											onChange={() => this.setBooleanAnswer(index)}
										/>
									</ValidationAwareFormGroup>
								</div>
							</div>
						))}
					</div>
				)}

				{this.props.kind === QuestionKind.MultipleChoice && (
					<div>
						<H3>Multiple Choice Options</H3>

						{this.state.currentChoices.map((answer, index) => (
							<div key={answer} style={{ display: "grid", gridTemplateColumns: "3fr,2fr", marginBottom: Spacing.Large }}>
								<div
									style={{
										display: "flex",
										gap: Spacing.Medium,
										width: "100%",
										alignItems: "center",
									}}
								>
									<ValidationAwareFormGroup labelFor={`answer-${index}`} failures={this.state.validationFailures}>
										<InputGroup
											id={`answer-${index}`}
											type="text"
											placeholder={"Answer"}
											defaultValue={answer}
											large={true}
											style={{ width: "100%" }}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												this.setState(({currentAnswers}) =>
													{
														currentAnswers[index] = e.target.value;
													}
												)
											}}
										/>
									</ValidationAwareFormGroup>

									<Button icon="remove" minimal onClick={() => this.props.removeAnswer(index)} />
								</div>

								<ValidationAwareFormGroup labelFor="correct_answer" failures={this.state.validationFailures}>
									<Radio
										id="correct_answer"
										label="Correct Answer"
										checked={index === this.state.currentAnswerIndex}
										onChange={() => this.setState({ currentAnswerIndex: index })}
									/>
								</ValidationAwareFormGroup>
							</div>
						))}

						<Button text="Add Answer" icon="plus" onClick={this.props.addAnswer} />
					</div>
				)}

				<hr style={{ marginTop: Spacing.XLarge, marginBottom: Spacing.XLarge, opacity: "0.3" }} />

				<Button
					large={true}
					intent={Intent.PRIMARY}
					text="Save Question"
					icon="floppy-disk"
					onClick={this.onSaveQuestionClick}
				/>
			</>
		);
	}

	private setBooleanLabel = (index: number, label: string) => {
		if (index === 0) {
			this.setState({ currentTrueLabel: label });
		} else {
			this.setState({ currentFalseLabel: label });
		}
	};

	private setBooleanAnswer = (index: number) => {
		if (index === 0) {
			this.setState({ currentAnswer: true });
		} else {
			this.setState({ currentAnswer: false });
		}
	};

	private onSaveQuestionClick = async () => {
		const accountId = this.context!.id;
		const tagId = this.state.currentTag!.id as number;

		// switch by kind and create question object
		switch (this.props.kind) {
			case QuestionKind.FreeText:
				const freeTextQuestion = {
					prompt: this.state.currentPrompt!,
					kind: this.state.currentKind!,
					answers: this.state.currentAnswers,
					accountId,
					tagId,
				};

				await this.props.saveQuestion(freeTextQuestion);

				break;

			case QuestionKind.Boolean:
				const booleanQuestion = {
					prompt: this.state.currentPrompt!,
					kind: this.state.currentKind!,
					answer: this.state.currentAnswer!,
					trueLabel: this.state.currentTrueLabel!,
					falseLabel: this.state.currentFalseLabel!,
					accountId,
					tagId,
				};

				await this.props.saveQuestion(booleanQuestion);

				break;

			case QuestionKind.MultipleChoice:
				const multipleChoiceQuestion = {
					prompt: this.state.currentPrompt!,
					kind: this.state.currentKind!,
					answerIndex: this.state.currentAnswerIndex!,
					choices: this.state.currentChoices,
					accountId,
					tagId,
				};

				await this.props.saveQuestion(multipleChoiceQuestion);

				break;

			default:
				break;
		}
	};
}
