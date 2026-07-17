import {ControlGroup, H3, InputGroup, Radio, RadioGroup} from '@blueprintjs/core';
import * as React from 'react';
import {BooleanQuestion} from '../../../../api/Quiz/Models/Questions';
import {FormControls} from '../../../../components/FormControls';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {BooleanSaveHandler, FormProps} from './index';

type Props = FormProps<BooleanQuestion, BooleanSaveHandler>;

interface State {
	answer: boolean;
	trueLabel: string;
	falseLabel: string;
	dirty: boolean;
}

export class BooleanForm extends React.PureComponent<Props, State> {
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
		const {answer, trueLabel, falseLabel} = this.state;

		return (
			<div className="question-form">
				<H3>True/False Question</H3>

				<ValidationAwareFormGroup label="Answer" labelFor="answer" failures={this.props.validationFailures}>
					<RadioGroup onChange={this.onAnswerChange} selectedValue={+answer} inline={true}>
						<Radio label={trueLabel.length > 0 ? trueLabel : 'True'} value={+true} />
						<Radio label={falseLabel.length > 0 ? falseLabel : 'False'} value={+false} />
					</RadioGroup>
				</ValidationAwareFormGroup>

				<ControlGroup fill={true}>
					<ValidationAwareFormGroup
						label="True Label"
						labelFor="trueLabel"
						failures={this.props.validationFailures}
					>
						<InputGroup
							name="trueLabel"
							value={trueLabel}
							onChange={this.onTrueLabelChange}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="False Label"
						labelFor="falseLabel"
						failures={this.props.validationFailures}
					>
						<InputGroup
							name="falseLabel"
							value={falseLabel}
							onChange={this.onFalseLabelChange}
						/>
					</ValidationAwareFormGroup>
				</ControlGroup>

				<FormControls
					onSaveClick={this.onSaveClick}
					loading={this.props.processing}
					dirty={this.isDirty()}
					redirectPath="/quiz/questions"
				/>
			</div>
		);
	}

	private isDirty = () => this.state.dirty || this.props.dirty;

	private onAnswerChange = (event: React.FormEvent<HTMLInputElement>) => this.setState({
		answer: !!parseInt(event.currentTarget.value),
		dirty: true,
	});

	private onTrueLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		trueLabel: event.currentTarget.value,
		dirty: true,
	});

	private onFalseLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		falseLabel: event.currentTarget.value,
		dirty: true,
	});

	private onSaveClick = () => this.props.onSave({
		answer: this.state.answer,
		trueLabel: this.state.trueLabel,
		falseLabel: this.state.falseLabel,
	});

	private copyFromProps = (): State => ({
		answer: this.props.question?.answer ?? true,
		trueLabel: this.props.question?.trueLabel ?? 'True',
		falseLabel: this.props.question?.falseLabel ?? 'False',
		dirty: false,
	});
}
