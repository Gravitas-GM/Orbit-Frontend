import * as React from 'react';
import {FormProps, FreeTextSaveHandler} from './index';
import {FreeTextQuestion} from '../../../../../Api/Quiz/Models/Questions';
import {Button, H3, InputGroup} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {replaceByIndex} from '../../../../Utility/array';
import {FormControls} from '../../../../FormControls';

type Props = FormProps<FreeTextQuestion, FreeTextSaveHandler>;

interface State {
	answers: string[];
	dirty: boolean;
}

export class FreeTextForm extends React.PureComponent<Props, State> {
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
				<H3>Free Text Question</H3>

				{this.state.answers.map((text, index) => (
					<AnswerItem
						text={text}
						index={index}
						validationFailures={this.props.validationFailures}
						onDelete={this.onAnswerDelete}
						onTextChange={this.onAnswerChange}
						isRemovable={this.state.answers.length > 1}
					/>
				))}

				<FormControls
					onSaveClick={this.onSave}
					loading={this.props.processing}
					dirty={this.isDirty()}
					redirectPath="/quiz/questions"
				>
					<Button icon="plus" text="Add Answer" onClick={this.onAddAnswerClick} />
				</FormControls>
			</div>
		);
	}

	private isDirty = () => this.state.dirty || this.props.dirty;

	private onAddAnswerClick = () => this.setState(state => ({
		answers: [...state.answers, ''],
		dirty: true,
	}));

	private onAnswerChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => this.setState(state => ({
		answers: replaceByIndex(state.answers, index, event.target.value),
		dirty: true,
	}));

	private onAnswerDelete = (index: number) => this.setState(state => ({
		answers: state.answers.filter((_, i) => i !== index),
		dirty: true,
	}));

	private onSave = () => this.props.onSave({
		answers: this.state.answers,
	});

	private copyFromProps = (): State => ({
		answers: this.props.question?.answers ?? [''],
		dirty: false,
	});
}

interface AnswerItemProps {
	text: string;
	index: number;
	validationFailures: ValidationFailures | null;
	onDelete: (index: number) => void;
	onTextChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
	isRemovable: boolean;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({
														  text,
														  index,
														  validationFailures,
														  onDelete,
														  onTextChange,
														  isRemovable,
													  }) => {
	const onDeleteClick = React.useCallback(() => onDelete(index), [index]);
	const onTextInputChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => onTextChange(event, index),
		[index],
	);

	const inputName = `answers[${index}]`;

	return (
		<ValidationAwareFormGroup
			label={index === 0 ? 'Answer' : ''}
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
					onClick={onDeleteClick}
					tabIndex={-1}
					disabled={!isRemovable}
				/>
			</div>
		</ValidationAwareFormGroup>
	);
};
