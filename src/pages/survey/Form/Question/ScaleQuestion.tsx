import {Slider} from '@blueprintjs/core';
import {ReactElement, ReactNode, useCallback, useState} from 'react';
import {ScaleQuestionLabels} from '../../../../api/Survey';
import {SurveyScaleQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type SliderChangeFn = (value: number) => void;
type SliderLabelRenderer = (value: number) => ReactNode;

interface Props extends QuestionProps<SurveyScaleQuestion> {
	min: number,
	max: number,
	stepSize: number,
	labels: ScaleQuestionLabels | null,
}

export function ScaleQuestion({index, onChange, labels, ...sliderProps}: Props): ReactElement {
	const [value, setValue] = useState(sliderProps.min);

	const onValueChange: SliderChangeFn = useCallback(value => {
		setValue(value);
		onChange(index, value);
	}, [index, onChange]);

	const renderLabel = useCallback<SliderLabelRenderer>(value => {
		if (!labels)
			return value;

		return labels[value] ?? value;
	}, [labels]);

	return (
		<Slider
			{...sliderProps}
			showTrackFill={false}
			value={value}
			onChange={onValueChange}
			labelRenderer={renderLabel}
		/>
	);
}
