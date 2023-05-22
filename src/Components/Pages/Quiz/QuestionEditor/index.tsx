import React, { useCallback, useEffect, useState } from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, H3, Icon, InputGroup, Intent, MenuItem, Radio } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState";
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { RouteComponentProps } from "react-router";
import { ItemRenderer, Select2 as Select } from "@blueprintjs/select";
import { ucwords } from "../../../Utility/string";
import { Question, QuestionKind, QuestionModel } from "../../../../Api/Quiz/Models/Questions";


// temporary dummy data and interfaces
import { questions } from "../../../../mocks/Questions";

export interface User {
	id: number;
	name: string;
	nextQuizTimestamp: Date;
	assignedTags: QuestionTag[];
}

export interface QuestionTag {
	id: number;
	label: string;
	members: User[];
}

const question_example: Question = questions[0];

// end temporary dummy data and interfaces

interface IQuestionEditorState {
	loading: boolean;
	question: Question | null;
	textAnswers: string[];
	prompt?: string;
	answerIndex?: number;
	kind?: QuestionKind;
}

interface IQuestionEditorProps {
	question?: string;
}

const QuestionKindNames = [QuestionKind.FreeText, QuestionKind.Boolean, QuestionKind.MultipleChoice].map((kind) =>
	ucwords(kind)
) as QuestionKind[];

export class QuestionEditorPage extends React.PureComponent<
	RouteComponentProps<IQuestionEditorProps>,
	IQuestionEditorState
> {
	public constructor(props: RouteComponentProps<IQuestionEditorProps>) {
		super(props);

		this.state = {
			loading: true,
			question: null,
			prompt: undefined,
			kind: undefined,
			answerIndex: undefined,
			textAnswers: [],
		};
	}

	public async componentDidMount() {
		// temporary fetch questions
		// if has route param, fetch question
		if (this.props.match.params.question) {
			await this.fetchQuestion();
		} else {
			this.setState({ loading: false });
		}
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.question ? `Edit Question` : `Add Question`} />

				<form>
					<div style={{ display: "flex", flexDirection: "column", width: "100%", gap: Spacing.xl }}>
						<div>
							<label htmlFor="prompt" style={{ marginBottom: Spacing.m, display: "block" }}>
								Prompt
							</label>

							<InputGroup
								name="prompt"
								type="text"
								placeholder={this.state.question ? this.state.question.prompt : "Question Prompt"}
								large={true}
							/>
						</div>

						<div>
							<label htmlFor="kind" style={{ marginBottom: Spacing.m, display: "block" }}>
								Question Kind
							</label>

							<Select<QuestionKind>
								// can you change question kind? I'll disable for now.
								disabled={this.state.question !== null}
								inputProps={{ name: "kind" }}
								items={QuestionKindNames}
								onItemSelect={this.selectQuestionKind}
								filterable={false}
								itemRenderer={renderQuestionKindOption}
								noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
							>
								<Button
									style={{ minWidth: 200 }}
									text={this.state.kind ? ucwords(this.state.kind) : "Select question kind"}
									rightIcon="double-caret-vertical"
									placeholder="Select question kind"
									disabled={this.state.question !== null}
								/>
							</Select>
						</div>
					</div>

					<hr style={{ marginTop: Spacing.xl, marginBottom: Spacing.xl, opacity: "0.3" }} />

					{/* there are different types of answers according to question type */}
					<RenderAnswerForm
						addAnswer={this.addAnswer}
						kind={this.state.kind}
						answers={this.state.textAnswers}
						removeAnswer={this.removeAnswer}
						saveQuestion={this.saveQuestion}
					/>
				</form>
			</section>
		);
	}

	private removeAnswer = (index: number) => {
		if (this.state.textAnswers.length <= 1) {
			// alert that you can't remove the last answer
			return;
		}

		this.setState(({ textAnswers }) => ({
			textAnswers: textAnswers.filter((_, i) => i !== index),
		}));
	};

	private addAnswer = () => {
		const newAnswer = "Answer " + (this.state.textAnswers.length + 1);
		if (this.state.textAnswers.length >= 5) {
			// alert that you can't add more than 5 answers
			return;
		}

		this.setState(({ textAnswers }) => ({ textAnswers: [...textAnswers, newAnswer] }));
	};

	private saveQuestion = async () => {};

	private selectQuestionKind = (kind: QuestionKind) => {
		switch (kind.toLocaleLowerCase()) {
			case QuestionKind.FreeText:
				this.setState({ kind: QuestionKind.FreeText, textAnswers: ["Answer 1"] });
				break;

			case QuestionKind.Boolean:
				this.setState({ kind: QuestionKind.Boolean, textAnswers: ["Truthy Statement", "Falsy Statement"] });
				break;

			case QuestionKind.MultipleChoice:
				this.setState({ kind: QuestionKind.MultipleChoice, textAnswers: ["Option 1"] });
				break;

			default:
				break;
		}
	};

	private fetchQuestion = async () => {
		this.setState({ loading: true });

		let question: Question | null = null;

		try {
			question = await QuestionModel.read(this.props.match.params.question!).then((res) => res.data);
			this.setState({ question: question, loading: false });
		} catch (err) {
			console.error(err);
			this.setState({ loading: false });
		}

		if (!question)
			return;

		// TODO: after fetching, set state according to quetion type:
		switch (question.kind) {
			case QuestionKind.FreeText:
				this.setState({
					question: question,
					loading: false,
					kind: question.kind,
					textAnswers: question.answers,
				});
				break;

			case QuestionKind.Boolean:
				this.setState({
					question: question,
					loading: false,
					kind: question.kind,
					textAnswers: ["1", "2"],
				});
				break;

			case QuestionKind.MultipleChoice:
				this.setState({
					question: question,
					loading: false,
					kind: question.kind,
					textAnswers: question.choices,
					answerIndex: question.answerIndex,
				});
				break;

			default:
				break;

		}
	};
}

const renderQuestionKindOption: ItemRenderer<QuestionKind> = (kind, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate) return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={kind}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={kind}
		/>
	);
};

interface IRenderAnswerFormProps {
	kind?: QuestionKind;
	answers: string[];
	answerIndex?: number;
	addAnswer: () => void;
	removeAnswer: (index: number) => void;
	saveQuestion: (question: Question) => void;
}

const RenderAnswerForm: React.FC<IRenderAnswerFormProps> = ({
	kind,
	answers,
	answerIndex,
	addAnswer,
	removeAnswer,
	saveQuestion,
}) => {
	const [currentAnswerIndex, setCurrentAnswerIndex] = useState<number>();

	useEffect(() => {
		setCurrentAnswerIndex(answerIndex);
	}, [answerIndex]);

	const saveQuestionCallback = useCallback(() => {
		// switch by kind and create question object
		switch (kind) {
			case QuestionKind.FreeText:
				saveQuestion(question_example);
				break;
			case QuestionKind.Boolean:
				saveQuestion(question_example);
				break;
			case QuestionKind.MultipleChoice:
				saveQuestion(question_example);
				break;
			default:
				break;
		}
	}, [kind]);

	if (!kind) return null;

	return (
		<>
			{kind === QuestionKind.FreeText && (
				<div>
					<H3>Free Text Alternatives</H3>

					{answers.map((answer, index) => (
						<div key={answer} style={{ display: "grid", gridTemplateColumns: "3fr,2fr" }}>
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
									type="text"
									placeholder={"Answer"}
									defaultValue={answer}
									large={true}
									style={{ width: "100%" }}
								/>
								<Button icon="remove" minimal onClick={() => removeAnswer(index)} />
							</div>
						</div>
					))}

					<Button text="Add Answer" icon="plus" onClick={addAnswer} />
				</div>
			)}

			{kind === QuestionKind.Boolean && (
				<div>
					<H3>Boolean Labels</H3>

					{answers.map((answer, index) => (
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

								<InputGroup
									type="text"
									placeholder={"Answer"}
									defaultValue={answer}
									large={true}
									style={{ width: "100%" }}
								/>
							</div>
						</div>
					))}
				</div>
			)}

			{kind === QuestionKind.MultipleChoice && (
				<div>
					<H3>Multiple Choice Options</H3>

					{answers.map((answer, index) => (
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
								<InputGroup
									type="text"
									placeholder={"Answer"}
									defaultValue={answer}
									large={true}
									style={{ width: "100%" }}
								/>
								<Button icon="remove" minimal onClick={() => removeAnswer(index)} />
							</div>

							<Radio
								label="Correct Answer"
								checked={index === currentAnswerIndex}
								onClick={() => setCurrentAnswerIndex(index)}
							/>
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
