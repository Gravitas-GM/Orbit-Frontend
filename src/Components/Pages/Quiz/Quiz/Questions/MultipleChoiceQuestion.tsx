import * as React from 'react';
import {MultipleChoiceItem} from './index';
import {H3, Radio} from '@blueprintjs/core';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';

interface Props {
	name: string,
	item: MultipleChoiceItem,
	index: number,
	setAnswer: (index: number, answer: MultipleChoiceItem['answer']) => void,
	validationFailures: ValidationFailures | null,
}

export const MultipleChoiceQuestion: React.FC<Props> = ({name, item, validationFailures, index, setAnswer}) => {
	const onAnswerChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setAnswer(index, parseInt(event.currentTarget.value, 10));
	}, [item]);

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={`${name}.answerIndex`}
			failures={validationFailures}
			failureMessage="This question has not been answered."
			className="quiz-item multiple-choice-item"
		>
			<div className="choices">
				{item.prompt.choices.map((text, index) => (
					<Radio
						key={index}
						name={name}
						label={text}
						value={index}
						onChange={onAnswerChange}
					/>
				))}
			</div>
		</ValidationAwareFormGroup>
	);
};
