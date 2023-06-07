import React from "react";
import { PageHeader } from "../../../PageHeader";
import { Button, InputGroup, MenuItem } from "@blueprintjs/core";
import { Spacing } from "../../../../Styles/variables";
import { NonIdealState } from "../../../NonIdealState"; // dont know if this is needed yet
import { FrameLoadingSpinner } from "../../../FrameLoadingSpinner";
import { RouteComponentProps } from "react-router";
import { ItemRenderer, Select2 as Select } from "@blueprintjs/select";
import { ucwords } from "../../../Utility/string";
import { QuestionTag, QuestionTagModel } from "../../../../Api/Quiz/Models/QuestionTags";
import { Question, QuestionCreatePayload, QuestionKind, QuestionModel } from "../../../../Api/Quiz/Models/Questions";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { AnswerForm } from "./AnswerForm";
import { ValidationFailures, isValidationFailureError } from "../../../../Api/errors/symfony";
import * as toaster from "../../../../Toaster";

// temporary dummy data and interfaces
import { questions } from "../../../../mocks/Questions";
import { questionTagsMock } from "../../../../mocks/QuestionTags";
const question_example: Question = questions[0];
// end temporary dummy data and interfaces

interface IQuestionEditorState {
	loading: boolean;
	question: Question | null;
	textAnswers: string[];
	prompt?: string;
	answerIndex?: number;
	kind?: QuestionKind;
	tags: QuestionTag[];
	selectedTag?: QuestionTag;
	validationFailures: ValidationFailures | null;
}

interface IQuestionEditorProps {
	question?: string;
}

// could be moved to models?
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
			tags: [],
			selectedTag: undefined,
			validationFailures: null,
		};
	}

	public async componentDidMount() {
		// temporary fetch questions and tags
		// if has route param, fetch question
		// promise all settled should be used here?

		if (this.props.match.params.question) {
			await this.fetchQuestion();
			await this.fetchTags();

			return;
		}

		await this.fetchTags();
	}

	public render() {
		if (this.state.loading)
			return <FrameLoadingSpinner />;

		return (
			<section className="gm-page-wrapper">
				<PageHeader title={this.props.match.params.question ? `Edit Question` : `Add Question`} />

				<form style={{ marginTop: Spacing.XLarge }}>
					<div style={{ display: "flex", flexDirection: "column", width: "100%", gap: Spacing.XLarge }}>
						<div>
							<label htmlFor="prompt" style={{ marginBottom: Spacing.Medium, display: "block" }}>
								Prompt
							</label>

							<ValidationAwareFormGroup labelFor="prompt" failures={this.state.validationFailures}>
								<InputGroup
									id="prompt"
									name="prompt"
									type="text"
									placeholder={this.state.question ? this.state.question.prompt : "Question Prompt"}
									large={true}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ prompt: e.target.value })}
								/>
							</ValidationAwareFormGroup>
						</div>

						<div style={{ display: "flex", gap: Spacing.Large }}>
							<div>
								<label htmlFor="question_kind" style={{ marginBottom: Spacing.Medium, display: "block" }}>
									Question Kind
								</label>
								<ValidationAwareFormGroup labelFor="question_kind" failures={this.state.validationFailures}>
									<Select<QuestionKind>
										// can you change question kind? I'll disable for now.
										disabled={this.state.question !== null}
										inputProps={{ name: "question_kind", id: "question_kind" }}
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
								</ValidationAwareFormGroup>
							</div>

							<div>
								<label htmlFor="kind" style={{ marginBottom: Spacing.Medium, display: "block" }}>
									Question Tag
								</label>
								<ValidationAwareFormGroup labelFor="question_tag" failures={this.state.validationFailures}>
									<Select<QuestionTag>
										disabled={this.state.question !== null}
										inputProps={{ name: "question_tag", id: "question_tag" }}
										items={questionTagsMock}
										onItemSelect={this.selectTag}
										filterable={false}
										itemRenderer={renderTagOption}
										noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
									>
										<Button
											style={{ minWidth: 200 }}
											text={this.state.selectedTag ? ucwords(this.state.selectedTag.label) : "Select question tag"}
											rightIcon="double-caret-vertical"
											placeholder="Select question tag"
											disabled={this.state.question !== null}
										/>
									</Select>
								</ValidationAwareFormGroup>
							</div>
						</div>
					</div>

					<hr style={{ marginTop: Spacing.XLarge, marginBottom: Spacing.XLarge, opacity: "0.3" }} />

					{/* there are different types of answers according to question type */}

					<AnswerForm
						kind={this.state.kind}
						prompt={this.state.prompt}
						tag={this.state.selectedTag}
						addAnswer={this.addAnswer}
						answers={this.state.textAnswers}
						removeAnswer={this.removeAnswer}
						saveQuestion={this.saveQuestion}
						failures={this.state.validationFailures}
					/>
				</form>
			</section>
		);
	}

	private fetchTags = async () => {
		// fetch tags
		try {
			const tags = await QuestionTagModel.list().then((res) => res.data);
			// const tags =  questionTagsMock
			this.setState({ tags, loading: false });
		} catch (err) {
			// redirect?
			toaster.error("Error fetching tags");
		}
	};

	private selectTag = (tag: QuestionTag) => {
		this.setState({ selectedTag: tag });
	};

	private removeAnswer = (index: number) => {
		if (this.state.textAnswers.length <= 1) {
			toaster.info("You must have at least one answer");

			return;
		}

		this.setState(({ textAnswers }) => ({
			textAnswers: textAnswers.filter((_, i) => i !== index),
		}));
	};

	private addAnswer = () => {
		const newAnswer = "Answer " + (this.state.textAnswers.length + 1);

		this.setState(({ textAnswers }) => ({ textAnswers: [...textAnswers, newAnswer] }));
	};

	private saveQuestion = async (questionCreatePayload: QuestionCreatePayload) => {
		console.log(questionCreatePayload, "this question will be created");

		let question: Question;

		try {
			question = await QuestionModel.create(questionCreatePayload).then((res) => res.data);
		} catch (err) {
			if (isValidationFailureError(err)) {
				toaster.error("Validation failed");

				this.setState({ validationFailures: err.context.failures });

				return;
			}

			return;
		}

		return question;
	};

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
			toaster.error("Error fetching question");
			// redirect?

			this.setState({ loading: false });
		}

		if (!question)
			return;

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

const renderTagOption: ItemRenderer<QuestionTag> = (tag, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate) return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={tag.label}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={tag.label}
		/>
	);
};
