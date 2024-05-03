import * as React from 'react';
import {Button, ControlGroup, TextArea} from '@blueprintjs/core';
import {MenuItem2 as MenuItem} from '@blueprintjs/popover2';
import {ItemRenderer} from '@blueprintjs/select';
import {isValidationFailureError, ValidationFailures} from '../../../../Api/errors/symfony';
import {Question, QuestionCreate, SurveyQuestionKind} from '../../../../Api/Survey/Models/BankQuestions';
import {Spacing} from '../../../../Styles/variables';
import {toaster} from '../../../../toaster';
import {Select} from '../../../Select/Select';
import {ucwords} from '../../../Utility/string';
import {ValidationAwareFormGroup} from '../../../ValidationAwareFormGroup';
import '../../Quiz/QuestionEditor/AnswerForm.scss';
import {QuestionTypeForm} from './QuestionTypeForm';

const QuestionKindNames = Object.values(SurveyQuestionKind);

export enum SurveyEditorType {
	NEXT = 'next',
	BANK = 'bank',
}

interface IProps {
	question: Question | null;
	processing: boolean;
	onSave: (question: QuestionCreate) => Promise<void>;
	survey: string;
}

interface IState {
	kind: SurveyQuestionKind;
	prompt: string;
	validationFailures: ValidationFailures | null;
	dirty: boolean;
}

export class QuestionForm extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			kind: props.question?.kind ?? SurveyQuestionKind.Choice,
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
							placeholder="How do you feel valued in this organization?"
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
					</div>
				</ControlGroup>

				<QuestionTypeForm
					survey={this.props.survey}
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

	private onPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		prompt: event.currentTarget.value,
		dirty: true,
	});

	private onKindChange = (kind: SurveyQuestionKind) => this.setState({
		kind,
		dirty: true,
	});

	private onSave = async (data: Partial<QuestionCreate>) => {
		if (!this.state.kind)
			return;

		try {
			await this.props.onSave({
				...data,
				survey: parseInt(this.props.survey),
				kind: this.state.kind,
				prompt: this.state.prompt,
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

	private renderQuestionKind: ItemRenderer<SurveyQuestionKind> = (kind, props) => {
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
}
