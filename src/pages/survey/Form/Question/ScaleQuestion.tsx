import {Slider} from '@blueprintjs/core';
import {ReactElement, useCallback, useState} from 'react';
import {SurveyScaleQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type SliderChangeFn = (value: number) => void;

interface Props extends QuestionProps<SurveyScaleQuestion> {
	min: number,
	max: number,
	stepSize: number,
}

export function ScaleQuestion({index, onChange, ...sliderProps}: Props): ReactElement {
	const [value, setValue] = useState(sliderProps.min);

	const onValueChange: SliderChangeFn = useCallback(value => {
		setValue(value);
		onChange(index, value);
	}, [index, onChange]);

	return (
		<Slider
			{...sliderProps}
			showTrackFill={false}
			value={value}
			onChange={onValueChange}
		/>
	);
}
