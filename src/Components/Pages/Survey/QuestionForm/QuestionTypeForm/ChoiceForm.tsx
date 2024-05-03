import * as React from 'react';
import {ChoiceQuestion} from '../../../../../Api/Survey/Models/BankQuestions';
import {SurveyEditorType} from '../index';
import {FormProps, ChoiceSaveHandler} from './index';
import {Button, ControlGroup, H3, InputGroup} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {replaceByIndex} from '../../../../Utility/array';
import {FormControls} from '../../../../FormControls';

type Props = FormProps<ChoiceQuestion, ChoiceSaveHandler>;

interface State {
	choices: string[];
	dirty: boolean;
}

export class ChoiceForm extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = this.copyFromProps();
	}

	public componentDidUpdate(prevProps: Readonly<Props>) {
		if (prevProps.question === this.props.question)
			return;

		this.setState(this.copyFromProps());
	}

	public render() {
		return (
			<div className="question-type-form">
				<H3>Choice Question</H3>

				{this.state.choices.map((text, index) => (
					<ChoiceItem
						isRemovable={this.state.choices.length > 1}
						text={text}
						index={index}
						validationFailures={this.props.validationFailures}
						onTextChange={this.onChoiceTextChange}
						onDeleteClick={this.onChoiceDelete}
					/>
				))}

				<FormControls
					onSaveClick={this.onSaveClick}
					loading={this.props.processing}
					dirty={this.isDirty()}
					redirectPath={(
						this.props.survey === SurveyEditorType.NEXT
							? '/survey/next'
							: `/survey/bank/${this.props.survey}`
					)}
				>
					<Button icon="plus" text="Add Choice" onClick={this.onAddChoiceClick} />
				</FormControls>
			</div>
		);
	}

	private isDirty = () => this.state.dirty || this.props.dirty;

	private onChoiceTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => this.setState(state => ({
		choices: replaceByIndex(state.choices, index, event.target.value),
		dirty: true,
	}));

	private onChoiceDelete = (index: number) => this.setState(state => {
		const choices = state.choices.filter((_, i) => i !== index);

		return {
			choices,
			dirty: true,
		};
	});

	private onAddChoiceClick = () => this.setState(state => ({
		choices: [...state.choices, ''],
		dirty: true,
	}));

	private onSaveClick = () => this.props.onSave({
		choices: this.state.choices,
	});

	private copyFromProps = (): State => ({
		choices: this.props.question?.choices ?? [''],
		dirty: false,
	});
}

interface ChoiceItemProps {
	text: string;
	index: number;
	validationFailures: ValidationFailures | null;
	onTextChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
	onDeleteClick: (index: number) => void;
	isRemovable: boolean;
}

const ChoiceItem: React.FC<ChoiceItemProps> = ({
	text,
	index,
	validationFailures,
	onTextChange,
	isRemovable,
	onDeleteClick,
}) => {
	const onDeleteButtonClick = React.useCallback(() => onDeleteClick(index), [index]);
	const onTextInputChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => onTextChange(event, index),
		[index],
	);

	const inputName = `choices[${index}]`;

	return (
		<ControlGroup key={index} fill={true}>
			<ValidationAwareFormGroup
				label={index === 0 ? 'Choice Label' : ''}
				labelFor={inputName}
				failures={validationFailures}
			>
				<div style={{display: 'flex'}}>
					<InputGroup
						name={inputName}
						value={text}
						onChange={onTextInputChange}
						fill={true}
					/>

					<Button
						icon="cross"
						minimal={true}
						style={{marginLeft: 5}}
						disabled={!isRemovable}
						onClick={onDeleteButtonClick}
						tabIndex={-1}
					/>
				</div>
			</ValidationAwareFormGroup>
		</ControlGroup>
	);
};
