import * as React from 'react';
import {ControlGroup, H3, NumericInput} from '@blueprintjs/core';
import {ScaleQuestion} from '../../../../../Api/Survey/Models/BankQuestions';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {FormControls} from '../../../../FormControls';
import {FormProps, ScaleSaveHandler} from './index';

type Props = FormProps<ScaleQuestion, ScaleSaveHandler>;

interface State {
	minValue: number;
	maxValue: number;
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
						label="Minimum Value"
						labelFor="minValue"
						failures={this.props.validationFailures}
					>
						<NumericInput
							min={0}
							name="minValue"
							onValueChange={this.onMinValueChange}
							value={this.state.minValue}
							fill={true}
						/>
					</ValidationAwareFormGroup>

					<ValidationAwareFormGroup
						label="Maximum Value"
						labelFor="maxValue"
						failures={this.props.validationFailures}
					>
						<NumericInput
							min={0}
							name="maxValue"
							onValueChange={this.onMaxValueChange}
							value={this.state.maxValue}
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

	private onMinValueChange = (minValue: number) => {
		if (isNaN(minValue) || minValue < 0)
			return;

		this.setState({
			minValue,
			dirty: true,
		});
	}

	private onMaxValueChange = (maxValue: number) => {
		if (isNaN(maxValue) || maxValue < 0)
			return;

		this.setState({
			maxValue,
			dirty: true,
		});
	}

	private onSaveClick = () => this.props.onSave({
		minValue: this.state.minValue,
		maxValue: this.state.maxValue,
	});

	private copyFromProps = (): State => ({
		minValue: this.props.question?.minValue ?? 1,
		maxValue: this.props.question?.maxValue ?? 5,
		dirty: false,
	});
}
