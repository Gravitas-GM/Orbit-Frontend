import * as React from 'react';
import {ControlGroup, H3, NumericInput} from '@blueprintjs/core';
import {ScaleQuestion} from '../../../../../Api/Survey/Models/BankQuestions';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {FormControls} from '../../../../FormControls';
import {FormProps, ScaleSaveHandler} from './index';

type Props = FormProps<ScaleQuestion, ScaleSaveHandler>;

interface State {
	startValue: number;
	endValue: number;
	stepAmount: number;
	dirty: boolean;
}

export class ScaleForm extends React.PureComponent<Props, State> {
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
				<H3>Scale Question</H3>

				<ControlGroup fill={true}>
					<ValidationAwareFormGroup
						label="Start Value"
						labelFor="startValue"
						failures={this.props.validationFailures}
					>
						<NumericInput
							min={0}
							name="startValue"
							onValueChange={this.onStartValueChange}
							value={this.state.startValue}
							fill={true}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="End Value"
						labelFor="endValue"
						failures={this.props.validationFailures}
					>
						<NumericInput
							min={0}
							name="endValue"
							onValueChange={this.onEndValueChange}
							value={this.state.endValue}
							fill={true}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="Step Amount"
						labelFor="stepAmount"
						failures={this.props.validationFailures}
					>
						<NumericInput
							min={0}
							name="stepAmount"
							onValueChange={this.onStepAmountChange}
							value={this.state.stepAmount}
							fill={true}
						/>
					</ValidationAwareFormGroup>
				</ControlGroup>

				<FormControls
					onSaveClick={this.onSaveClick}
					loading={this.props.processing}
					dirty={this.isDirty()}
					redirectPath="/survey/bank"
				/>
			</div>
		);
	}

	private isDirty = () => this.state.dirty || this.props.dirty;

	private onStartValueChange = (minValue: number) => {
		if (isNaN(minValue) || minValue < 0)
			return;

		this.setState({
			startValue: minValue,
			dirty: true,
		});
	}

	private onEndValueChange = (maxValue: number) => {
		if (isNaN(maxValue) || maxValue < 0)
			return;

		this.setState({
			endValue: maxValue,
			dirty: true,
		});
	}

	private onStepAmountChange = (stepAmount: number) => {
		if (isNaN(stepAmount) || stepAmount < 1)
			return;

		this.setState({
			stepAmount: stepAmount,
			dirty: true,
		});
	}

	private onSaveClick = () => this.props.onSave({
		startValue: this.state.startValue,
		endValue: this.state.endValue,
		stepAmount: this.state.stepAmount,
	});

	private copyFromProps = (): State => ({
		startValue: this.props.question?.startValue ?? 1,
		endValue: this.props.question?.endValue ?? 5,
		stepAmount: this.props.question?.stepAmount ?? 1,
		dirty: false,
	});
}
