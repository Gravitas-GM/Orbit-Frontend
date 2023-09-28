import * as React from 'react';
import {MultipleChoiceItem} from './index';
import {H3, Radio} from '@blueprintjs/core';
import {ValidationFailures} from '../../../../../Api/errors/symfony';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';

interface Props {
	item: MultipleChoiceItem,
	validationFailures: ValidationFailures | null,
}

export const MultipleChoiceQuestion: React.FC<Props> = ({item, validationFailures}) => {
	const onAnswerChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = parseInt(event.currentTarget.value, 10);
	}, [item]);

	const name = `item-${item.prompt.id}`;

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={name}
			failures={validationFailures}
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
