import * as React from 'react';
import {FreeTextItem} from './index';
import {H3, InputGroup} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';

interface Props {
	name: string,
	item: FreeTextItem,
	index: number,
	setAnswer: (index: number, answer: FreeTextItem['answer']) => void,
	validationFailures: ValidationFailures | null,
}

export const FreeTextQuestion: React.FC<Props> = ({name, item, validationFailures, index, setAnswer}) => {
	const [answerText, setAnswerText] = React.useState(item.answer);

	const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setAnswerText(event.currentTarget.value);
		setAnswer(index, event.currentTarget.value);
	}, []);

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={`${name}.answer`}
			failures={validationFailures}
			failureMessage="This question has not been answered."
			className="quiz-item free-text-item"
		>
			<InputGroup
				name={`item-${item.prompt.id}`}
				value={answerText ?? ''}
				onChange={onChange}
			/>
		</ValidationAwareFormGroup>
	);
};
