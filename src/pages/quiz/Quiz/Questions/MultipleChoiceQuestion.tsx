import {H3, Radio} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../../../../api/errors/symfony';
import {ValidationAwareFormGroup} from '../../../../components/ValidationAwareFormGroup';
import {MultipleChoiceItem} from './index';

interface Props {
	name: string,
	item: MultipleChoiceItem,
	validationFailures: ValidationFailures | null,
}

export function MultipleChoiceQuestion({name, item, validationFailures}: Props): React.ReactElement {
	const onAnswerChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = parseInt(event.currentTarget.value, 10);
	}, [item]);

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={`${name}.answerIndex`}
			failures={validationFailures}
			failureMessage="This question has not been answered."
			className={`quiz-item multiple-choice-item question-${item.prompt.id}`}
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
}
