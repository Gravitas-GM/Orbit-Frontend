import {Radio} from '@blueprintjs/core';
import {ChangeEventHandler, ReactElement, useCallback, useState} from 'react';
import {SurveyChoiceQuestion} from '../../../../api/Survey/Models/SurveyQuestion';
import {QuestionProps} from './index';

interface Props extends QuestionProps<SurveyChoiceQuestion> {
	choices: string[],
}

export function ChoiceQuestion({index: questionIndex, choices, onChange}: Props): ReactElement {
	const [value, setValue] = useState(0);

	const onValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
		const value = parseInt(event.currentTarget.value);

		setValue(value);
		onChange(questionIndex, value);
	}, [questionIndex, onChange]);

	return (
		<div>
			{choices.map((choice, index) => (
				<Radio
					key={index}
					name={`responses[${questionIndex}].response`}
					label={choice}
					value={index}
					checked={index === value}
					onChange={onValueChange}
				/>
			))}
		</div>
	);
}
