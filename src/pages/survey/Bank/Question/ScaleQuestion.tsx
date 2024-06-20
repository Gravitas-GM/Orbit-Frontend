import {H3, NumericInput} from '@blueprintjs/core';
import {ReactElement, useCallback, useImperativeHandle, useState} from 'react';
import {BaseScaleQuestion, QuestionKind} from '../../../../api/Survey';
import {Grid} from '../../../../components/Grid';
import {PageHeader} from '../../../../components/PageHeader';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {QuestionFormProps} from './index';

type Props = QuestionFormProps<BaseScaleQuestion>;
type NumericInputChangeFn = (value: number) => void;

export function ScaleQuestion({onDirtyChange, question, save, validation}: Props): ReactElement {
	const [startValue, setStartValue] = useState(question?.startValue ?? 1);
	const [endValue, setEndValue] = useState(question?.endValue ?? 5);
	const [stepAmount, setStepAmount] = useState(question?.stepAmount ?? 1);

	const onStartValueChange = useCallback<NumericInputChangeFn>(value => {
		setStartValue(value);
		onDirtyChange(true);
	}, []);

	const onEndValueChange = useCallback<NumericInputChangeFn>(value => {
		setEndValue(value);
		onDirtyChange(true);
	}, []);

	const onStepAmountChange = useCallback<NumericInputChangeFn>(value => {
		setStepAmount(value);
		onDirtyChange(true);
	}, []);

	useImperativeHandle(save, () => () => ({
		kind: QuestionKind.Scale,
		startValue,
		endValue,
		stepAmount,
	}), [startValue, endValue, stepAmount]);

	return (
		<div>
			<PageHeader title="Scale" heading={H3} />

			<Grid columns={3}>
				<ValidationAwareFormGroup label="Start Value" labelFor="startValue" failures={validation} fill={true}>
					<NumericInput
						value={startValue}
						onValueChange={onStartValueChange}
						fill={true}
						min={1}
						max={Math.max(1, endValue - stepAmount)}
					/>
				</ValidationAwareFormGroup>

				<ValidationAwareFormGroup label="End Value" labelFor="endValue" failures={validation} fill={true}>
					<NumericInput
						value={endValue}
						onValueChange={onEndValueChange}
						fill={true}
						min={startValue + stepAmount}
					/>
				</ValidationAwareFormGroup>

				<ValidationAwareFormGroup label="Step Amount" labelFor="stepAmount" failures={validation} fill={true}>
					<NumericInput value={stepAmount} onValueChange={onStepAmountChange} fill={true} min={1} />
				</ValidationAwareFormGroup>
			</Grid>
		</div>
	);
}
