import {Slider} from '@blueprintjs/core';
import {ReactElement, useCallback, useState} from 'react';
import {SurveyScaleQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type Props = QuestionProps<SurveyScaleQuestion>;
type SliderChangeFn = (value: number) => void;

export function ScaleQuestion({question}: Props): ReactElement {
	const [value, setValue] = useState(question.startValue);

	const onChange: SliderChangeFn = useCallback(setValue, []);

	return (
		<Slider
			min={question.startValue}
			max={question.endValue}
			stepSize={question.stepAmount}
			showTrackFill={false}
			value={value}
			onChange={onChange}
		/>
	);
}
