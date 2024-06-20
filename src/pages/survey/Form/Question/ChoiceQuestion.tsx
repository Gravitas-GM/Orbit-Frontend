import {Radio} from '@blueprintjs/core';
import {ChangeEventHandler, ReactElement, useCallback, useState} from 'react';
import {SurveyChoiceQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

type Props = QuestionProps<SurveyChoiceQuestion>;

export function ChoiceQuestion({question, index: questionIndex}: Props): ReactElement {
	const [responseIndex, setResponseIndex] = useState<number | null>(null);
	const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
		const value = parseInt(event.currentTarget.value, 10);
		setResponseIndex(isNaN(value) ? null : value);
	}, []);

	return (
		<div>
			{question.choices.map((choice, index) => (
				<Radio
					key={index}
					name={`responses[${questionIndex}].response`}
					label={choice}
					value={index}
					checked={index === responseIndex}
					onChange={onChange}
				/>
			))}
		</div>
	);
}
