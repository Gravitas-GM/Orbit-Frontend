import {Checkbox, FormGroup, H3, InputGroup, NumericInput} from '@blueprintjs/core';
import {
	ChangeEventHandler,
	FocusEventHandler,
	ReactElement,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import {BaseScaleQuestion, QuestionKind, ScaleQuestionLabels} from '../../../../api/Survey';
import {Grid} from '../../../../components/Grid';
import {PageHeader} from '../../../../components/PageHeader';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {QuestionFormProps} from './index';

type Props = QuestionFormProps<BaseScaleQuestion>;
type NumericInputChangeFn = (value: number) => void;

type NullableLabels = { [key: string]: string | null };

export function ScaleQuestion({onDirtyChange, question, save, validation}: Props): ReactElement {
	const [startValue, setStartValue] = useState(question?.startValue ?? 1);
	const [endValue, setEndValue] = useState(question?.endValue ?? 5);
	const [stepAmount, setStepAmount] = useState(question?.stepAmount ?? 1);
	const [labels, setLabels] = useState<NullableLabels | null>(null);

	const [useCustomLabels, setUseCustomLabels] = useState(!!question?.labels);

	const onStartValueChange = useCallback<NumericInputChangeFn>(value => {
		setStartValue(value);
		onDirtyChange(true);
	}, []);

	const onEndValueChange = useCallback<NumericInputChangeFn>(value => {
		setEndValue(value);
		onDirtyChange(true);
	}, [labels]);

	const onStepAmountChange = useCallback<NumericInputChangeFn>(value => {
		setStepAmount(value);
		onDirtyChange(true);
	}, []);

	const onUseCustomLabelsChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
		setUseCustomLabels(event.currentTarget.checked);
	}, []);

	useEffect(() => {
		if (!useCustomLabels) {
			setLabels(null);
			return;
		}

		const baseLabels = question?.labels ?? {};
		const labels: NullableLabels = {};

		for (let i = startValue; i <= endValue; i += stepAmount)
			labels[i] = baseLabels[i] ?? null;

		setLabels(labels);
	}, [useCustomLabels, question?.labels, startValue, endValue, stepAmount]);

	useImperativeHandle(save, () => () => {
		let cleanedLabels: ScaleQuestionLabels | null = null;

		if (labels !== null) {
			cleanedLabels = {};

			for (const [key, value] of Object.entries(labels)) {
				if (value === null)
					continue;

				cleanedLabels[key] = value;
			}
		}

		return {
			kind: QuestionKind.Scale,
			startValue,
			endValue,
			stepAmount,
			labels: cleanedLabels,
		};
	}, [startValue, endValue, stepAmount, labels]);

	return (
		<div>
			<PageHeader title="Scale" heading={H3} />

			<Grid columns={4}>
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

				<FormGroup label={<>&nbsp;</>}>
					<Checkbox
						label="Use custom step labels"
						checked={useCustomLabels}
						onChange={onUseCustomLabelsChange}
					/>
				</FormGroup>
			</Grid>

			{labels && <Labels labels={labels} onChange={setLabels} />}
		</div>
	);
}

type LabelsChangeFn = (labels: NullableLabels) => void;

interface LabelsProps {
	labels: NullableLabels,
	onChange: LabelsChangeFn,
}

function Labels({labels, onChange}: LabelsProps): ReactElement {
	const onLabelChange = useCallback<LabelChangeFn>((key, value) => {
		labels[key] = value.length > 0 ? value : null;
		onChange({...labels});
	}, [labels, onChange]);

	return (
		<>
			{Object.entries(labels).map(([key, value]) => (
				<Label key={key} labelKey={key} value={value} onChange={onLabelChange} />
			))}
		</>
	);
}

type LabelChangeFn = (key: string, value: string) => void;

interface LabelProps {
	labelKey: string,
	value: string | null,
	onChange: LabelChangeFn,
}

function Label({labelKey, value, onChange}: LabelProps): ReactElement {
	const onValueChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
		onChange(labelKey, event.currentTarget.value);
	}, [labelKey, onChange]);

	const onValueBlur = useCallback<FocusEventHandler<HTMLInputElement>>(event => {
		onChange(labelKey, event.currentTarget.value.trim());
	}, [labelKey, onChange]);

	const inputName = `label[${labelKey}]`;

	return (
		<FormGroup labelFor={inputName} label={`Option #${labelKey}`}>
			<InputGroup
				name={inputName}
				value={value ?? ''}
				placeholder={labelKey}
				onChange={onValueChange}
				onBlur={onValueBlur}
			/>
		</FormGroup>
	);
}
