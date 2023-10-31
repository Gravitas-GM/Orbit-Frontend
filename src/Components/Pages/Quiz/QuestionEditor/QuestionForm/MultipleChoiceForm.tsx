import * as React from 'react';
import {FormProps, MultipleChoiceSaveHandler} from './index';
import {MultipleChoiceQuestion} from '../../../../../Api/Quiz/Models/Questions';
import {Button, ControlGroup, FormGroup, H3, InputGroup, Radio} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {replaceByIndex} from '../../../../Utility/array';
import {Controls} from './Controls';

type Props = FormProps<MultipleChoiceQuestion, MultipleChoiceSaveHandler>;

interface State {
	choices: string[];
	answerIndex: number;
	dirty: boolean;
}

export class MultipleChoiceForm extends React.PureComponent<Props, State> {
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
			<div className="question-form">
				<H3>Multiple Choice Question</H3>

				{this.state.choices.map((text, index) => (
					<ChoiceItem
						key={`choice-${text}`}
						isRemovable={this.state.choices.length > 1}
						text={text}
						index={index}
						isAnswer={this.state.answerIndex === index}
						validationFailures={this.props.validationFailures}
						onTextChange={this.onChoiceTextChange}
						onAnswerChange={this.onAnswerIndexChange}
						onDeleteClick={this.onChoiceDelete}
					/>
				))}

				<Controls onSaveClick={this.onSaveClick} onCancel={this.props.onCancel} loading={this.props.processing} dirty={this.isDirty()}>
					<Button icon="plus" text="Add Choice" onClick={this.onAddChoiceClick} />
				</Controls>
			</div>
		);
	}

	private isDirty = () => this.state.dirty || this.props.dirty;

	private onChoiceTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => this.setState(state => ({
		// event.target is actually correct this time. A ChangeEvent cannot be dispatched from any node EXCEPT for the
		// input node to which the handler is registered, so we can reasonably assume that target === currentTarget.
		//
		// Also for some stupid fucked up reason React isn't setting currentTarget for this event (at least in Firefox
		// at time of writing) so I GUESS WE NEED TO USE event.target.
		choices: replaceByIndex(state.choices, index, event.target.value),
		dirty: true,
	}));

	private onAnswerIndexChange = (index: number) => this.setState({
		answerIndex: index,
		dirty: true,
	});

	private onChoiceDelete = (index: number) => this.setState(state => {
		const choices = state.choices.filter((_, i) => i !== index);

		return {
			choices,
			answerIndex: Math.min(state.answerIndex, choices.length - 1),
			dirty: true,
		};
	});

	private onAddChoiceClick = () => this.setState(state => ({
		choices: [...state.choices, ''],
		dirty: true,
	}));

	private onSaveClick = () => this.props.onSave({
		choices: this.state.choices,
		answerIndex: this.state.answerIndex,
	});

	private copyFromProps = (): State => ({
		choices: this.props.question?.choices ?? [''],
		answerIndex: this.props.question?.answerIndex ?? 0,
		dirty: false,
	});
}

interface ChoiceItemProps {
	text: string;
	index: number;
	isAnswer: boolean;
	validationFailures: ValidationFailures | null;
	onTextChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
	onAnswerChange: (index: number) => void;
	onDeleteClick: (index: number) => void;
	isRemovable: boolean;
}

const ChoiceItem: React.FC<ChoiceItemProps> = ({
	text,
	index,
	isAnswer,
	validationFailures,
	onTextChange,
	onAnswerChange,
	isRemovable,
	onDeleteClick,
}) => {
	const onAnswerInputChange = React.useCallback(() => onAnswerChange(index), [index]);
	const onDeleteButtonClick = React.useCallback(() => onDeleteClick(index), [index]);
	const onTextInputChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => onTextChange(event, index),
		[index],
	);

	const inputName = `choices[${index}]`;

	return (
		<ControlGroup key={index} fill={true}>
			<FormGroup label={index === 0 ? 'Correct?' : ''} style={{maxWidth: 75}}>
				<div style={{marginLeft: 15}}>
					<Radio
						name="answerIndex"
						value={index}
						checked={isAnswer}
						onChange={onAnswerInputChange}
						tabIndex={-1}
					/>
				</div>
			</FormGroup>

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
