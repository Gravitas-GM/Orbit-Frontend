import {Slider} from '@blueprintjs/core';
import {ReactElement, useCallback} from 'react';
import {SurveyScaleQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type Props = QuestionProps<SurveyScaleQuestion>;
type SliderChangeFn = (value: number) => void;

export function ScaleQuestion({question, onChange}: Props): ReactElement {
	const onSliderChange: SliderChangeFn = useCallback(value => {
		onChange(question, {
			response: value,
		});
	}, [question, onChange]);

	return (
		<Slider
			min={question.startValue}
			max={question.endValue}
			stepSize={question.stepAmount}
			showTrackFill={false}
			value={3}
			onChange={onSliderChange}
		/>
	);
}
