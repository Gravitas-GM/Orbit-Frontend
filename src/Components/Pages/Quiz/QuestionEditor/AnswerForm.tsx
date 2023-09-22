import * as React from 'react';
import {Button, ControlGroup, Intent, TextArea} from '@blueprintjs/core';
import {Question, QuestionCreate, QuestionKind} from '../../../../Api/Quiz/Models/Questions';
import {Spacing} from '../../../../Styles/variables';
import {QuestionTag} from '../../../../Api/Quiz/Models/QuestionTags';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {ItemRenderer} from '@blueprintjs/select';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ucwords} from '../../../Utility/string';
import './AnswerForm.scss';
import * as toaster from '../../../../Toaster';
import {Link} from 'react-router-dom';
import {QuestionForm} from './QuestionForm';
import {Select} from '../../../Select/Select';

const QuestionKindNames = Object.values(QuestionKind);

interface IProps {
	question: Question | null;
	tags: QuestionTag[];
	processing: boolean;
	onSave: (question: QuestionCreate) => Promise<void>;
}

interface IState {
	kind: QuestionKind;
	tag: QuestionTag | null;
	prompt: string;
	validationFailures: ValidationFailures | null;
	dirty: boolean;
}

export class AnswerForm extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		const tag = props.question?.tag ? props.tags.find(item => item.id === props.question!.tag!.id) : null;

		if (tag === undefined)
			throw new Error('Could not find question tag in tags list');

		this.state = {
			tag,
			// TODO Change this back to QuestionKind.MultipleChoice /tyler
			kind: props.question?.kind ?? QuestionKind.FreeText,
			prompt: props.question?.prompt ?? '',
			validationFailures: null,
			dirty: false,
		};
	}

	public render() {
		const isKindSelectDisabled = this.props.question !== null;

		return (
			<form id="question-editor-fields" style={{marginTop: Spacing.XLarge}}>
				<ControlGroup fill={true}>
					<ValidationAwareFormGroup
						label="Prompt"
						labelFor="prompt"
						failures={this.state.validationFailures}
						style={{flex: 1}}
					>
						<TextArea
							fill={true}
							growVertically={true}
							name="prompt"
							placeholder="Is this sentence true?"
							value={this.state.prompt}
							onChange={this.onPromptChange}
						/>
					</ValidationAwareFormGroup>

					<div style={{flex: 1}}>
						<ValidationAwareFormGroup
							label="Question Kind"
							labelFor="kind"
							failures={this.state.validationFailures}
						>
							<Select
								disabled={isKindSelectDisabled}
								inputProps={{
									name: 'kind',
								}}
								items={QuestionKindNames}
								onItemSelect={this.onKindChange}
								filterable={false}
								itemRenderer={this.renderQuestionKind}
								fill={true}
							>
								<Button
									disabled={isKindSelectDisabled}
									fill={true}
									alignText="left"
									text={this.state.kind ? ucwords(this.state.kind) : 'Select question kind'}
									rightIcon="double-caret-vertical"
									placeholder="Select question kind"
								/>
							</Select>
						</ValidationAwareFormGroup>

						<ValidationAwareFormGroup
							label="Question Tag"
							labelFor="tag"
							failures={this.state.validationFailures}
							helperText={this.renderEmptyQuestionTagsWarning()}
							intent={Intent.WARNING}
						>
							<Select
								disabled={this.props.tags.length === 0}
								inputProps={{
									name: 'tag',
								}}
								fill={true}
								items={this.props.tags}
								onItemSelect={this.onTagChange}
								filterable={false}
								itemRenderer={this.renderQuestionTag}
								onClear={this.onTagClear}
							>
								<Button
									disabled={this.props.tags.length === 0}
									fill={true}
									alignText="left"
									text={this.state.tag ? ucwords(this.state.tag.label) : 'No Tag'}
									rightIcon="double-caret-vertical"
									placeholder="Select question tag"
								/>
							</Select>
						</ValidationAwareFormGroup>
					</div>
				</ControlGroup>

				<QuestionForm
					dirty={this.state.dirty}
					kind={this.state.kind}
					onSave={this.onSave}
					validationFailures={this.state.validationFailures}
					question={this.props.question}
					processing={this.props.processing}
				/>
			</form>
		);
	}

	private renderEmptyQuestionTagsWarning(): React.ReactNode {
		if (this.props.tags.length > 0)
			return null;

		return (
			<span>
				Your account has no question tags. <Link to="/quiz/tags">Click here</Link> to create one.
			</span>
		);
	}

	private onPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		prompt: event.currentTarget.value,
		dirty: true,
	});

	private onKindChange = (kind: QuestionKind) => this.setState({
		kind,
		dirty: true,
	});

	private onTagChange = (tag: QuestionTag) => this.setState({
		tag,
		dirty: true,
	});

	private onTagClear = () => this.setState({
		tag: null,
		dirty: true,
	});

	private onSave = async (data: Partial<QuestionCreate>) => {
		if (!this.state.kind)
			return;

		try {
			await this.props.onSave({
				...data,
				kind: this.state.kind,
				prompt: this.state.prompt,
				tag: this.state.tag?.id,
			} as QuestionCreate);
		} catch (error) {
			if (isValidationFailureError(error)) {
				toaster.showValidationFailedErrorMessage();

				this.setState({
					validationFailures: error.context.failures,
				});
			} else
				toaster.showUnhandledErrorMessage();
		}
	};

	private renderQuestionKind: ItemRenderer<QuestionKind> = (kind, props) => {
		if (!props.modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				selected={kind === this.state.kind}
				active={props.modifiers.active}
				disabled={props.modifiers.disabled}
				key={kind}
				onClick={props.handleClick}
				onFocus={props.handleFocus}
				roleStructure="listoption"
				text={ucwords(kind)}
			/>
		);
	};

	private renderQuestionTag: ItemRenderer<QuestionTag> = (tag, props) => {
		if (!props.modifiers.matchesPredicate)
			return null;

		return (
			<MenuItem
				selected={tag === this.state.tag}
				active={props.modifiers.active}
				disabled={props.modifiers.disabled}
				key={tag.label}
				onClick={props.handleClick}
				onFocus={props.handleFocus}
				roleStructure="listoption"
				text={tag.label}
			/>
		);
	};
}
