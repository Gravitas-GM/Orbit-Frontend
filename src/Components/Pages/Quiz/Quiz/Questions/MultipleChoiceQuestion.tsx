import * as React from 'react';
import {MultipleChoiceItem} from './index';
import {H3, Radio} from '@blueprintjs/core';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';

interface Props {
	name: string,
	item: MultipleChoiceItem,
	validationFailures: ValidationFailures | null,
}

export const MultipleChoiceQuestion: React.FC<Props> = ({name, item, validationFailures}) => {
	const onAnswerChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = parseInt(event.currentTarget.value, 10);
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
					<div className="choice" key={index}>
						<Radio
							name={name}
							label={text}
							value={index}
							onChange={onAnswerChange}
						/>
					</div>
				))}
			</div>
		</ValidationAwareFormGroup>
	);
};
