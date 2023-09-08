import * as React from 'react';
import { InputGroup, Button, MenuItem } from "@blueprintjs/core";
import {QuestionKind, Question, QuestionUpdate} from '../../../../Api/Quiz/Models/Questions';
import { Spacing } from "../../../../Styles/variables";
import { QuestionTag } from "../../../../Api/Quiz/Models/QuestionTags";
import { ValidationAwareFormGroup } from "../../../ValidationAwareFormGroup";
import { ValidationFailures } from "../../../../Api/errors/symfony";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { ucwords } from "../../../Utility/string";
import { BooleanQuestion } from "./QuizQuestions/BooleanQuestion";
import { FreeTextQuestion } from "./QuizQuestions/FreeTextQuestion";
import { MultipleChoiceQuestion } from "./QuizQuestions/MultipleChoiceQuestion";
import { UserContext } from "../../../../Session";
import "./AnswerForm.scss";

const QuestionKindNames = Object.values(QuestionKind);

interface IProps {
	question: Question | null;
	tags: QuestionTag[];
	processing: boolean;
	validationFailures: ValidationFailures | null;
	onQuestionSave: (question: QuestionUpdate) => Promise<void>;
}

interface IState {
	question: Question | null;
	kind?: QuestionKind;
	tag?: QuestionTag;
	prompt?: string;
	answers: string[];
}

export class AnswerForm extends React.PureComponent<IProps, IState> {
	public static contextType = UserContext;
	declare context: React.ContextType<typeof UserContext>;

	public state: Readonly<IState> = {
		answers: [],
		tag: undefined,
		kind: this.props.question?.kind ?? undefined,
		prompt: this.props.question?.prompt ?? undefined,
		question: this.props.question ?? null,
	};

	public componentDidMount(): void {
		if (this.props.question) {
			this.setState({
				tag: this.props.tags.find(tag => tag.id === this.props.question?.tag?.id),
			});
		}
	}

	public render() {
		if (this.props.tags.length === 0)
			return;

		return (
			<form style={{ marginTop: Spacing.XLarge }}>
				<div className="answer-form-container">
					<div>
						<label htmlFor="prompt" className="answer-form-label">
							Prompt
						</label>

						<ValidationAwareFormGroup labelFor="prompt" failures={this.props.validationFailures}>
							<InputGroup
								id="prompt"
								name="prompt"
								type="text"
								placeholder={this.state.question ? this.state.question.prompt : "Question Prompt"}
								value={this.state.prompt ?? ""}
								large={true}
								onChange={this.onChangePrompt}
							/>
						</ValidationAwareFormGroup>
					</div>

					<div className="answer-form-container">
						<div>
							<label htmlFor="question_kind" className="answer-form-label">
								Question Kind
							</label>

							<ValidationAwareFormGroup labelFor="question_kind" failures={this.props.validationFailures}>
								<Select<QuestionKind>
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
									/>
								</Select>
							</ValidationAwareFormGroup>
						</div>

						<div>
							<label htmlFor="kind" className="answer-form-label">
								Question Tag
							</label>

							<ValidationAwareFormGroup labelFor="question_tag" failures={this.props.validationFailures}>
								<Select<QuestionTag>
									inputProps={{ name: "question_tag", id: "question_tag" }}
									items={this.props.tags}
									onItemSelect={this.selectTag}
									filterable={false}
									itemRenderer={renderTagOption}
									noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
								>
									<Button
										style={{ minWidth: 200 }}
										text={this.state.tag ? ucwords(this.state.tag.label) : "Select question tag"}
										rightIcon="double-caret-vertical"
										placeholder="Select question tag"
									/>
								</Select>
							</ValidationAwareFormGroup>
						</div>
					</div>
				</div>

				<hr className="answer-form-separator" />

				{this.state.kind === QuestionKind.Boolean && this.state.tag && (
					<BooleanQuestion
						question={this.state.question}
						prompt={this.state.prompt}
						tagId={this.state.tag.id as number}
						processing={this.props.processing}
						onQuestionSave={this.props.onQuestionSave}
						validationFailures={this.props.validationFailures}
					/>
				)}

				{this.state.kind === QuestionKind.FreeText && this.state.tag && (
					<FreeTextQuestion
						question={this.state.question}
						prompt={this.state.prompt}
						tagId={this.state.tag.id as number}
						processing={this.props.processing}
						onQuestionSave={this.props.onQuestionSave}
						validationFailures={this.props.validationFailures}
					/>
				)}

				{this.state.kind === QuestionKind.MultipleChoice && this.state.tag && (
					<MultipleChoiceQuestion
						question={this.state.question}
						prompt={this.state.prompt}
						tagId={this.state.tag.id as number}
						processing={this.props.processing}
						onQuestionSave={this.props.onQuestionSave}
						validationFailures={this.props.validationFailures}
					/>
				)}
			</form>
		);
	}

	private selectTag = (tag: QuestionTag) => {
		this.setState({
			tag,
		});
	};

	private selectQuestionKind = (kind: QuestionKind) => {
		this.setState({
			kind,
		});
	};

	private onChangePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			prompt: event.target.value,
		});
	}
}

const renderTagOption: ItemRenderer<QuestionTag> = (tag, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate)
	return null;

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

const renderQuestionKindOption: ItemRenderer<QuestionKind> = (kind, { handleClick, handleFocus, modifiers }) => {
	if (!modifiers.matchesPredicate)
		return null;

	return (
		<MenuItem
			active={modifiers.active}
			disabled={modifiers.disabled}
			key={kind}
			onClick={handleClick}
			onFocus={handleFocus}
			roleStructure="listoption"
			text={ucwords(kind)}
		/>
	);
};
