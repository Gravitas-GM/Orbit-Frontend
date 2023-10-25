import * as React from 'react';
import {BooleanItem} from './index';
import {H3, Radio} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';

interface Props {
	name: string,
	item: BooleanItem,
	index: number,
	setAnswer: (inde: number, answer: BooleanItem['answer']) => void,
	validationFailures: ValidationFailures | null,
}

export const BooleanQuestion: React.FC<Props> = ({name, item, validationFailures, setAnswer, index}) => {
	const onResponseChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setAnswer(index, !!parseInt(event.currentTarget.value, 10));
	}, [item]);

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={`${name}.answer`}
			failures={validationFailures}
			failureMessage="This question has not been answered."
			className="quiz-item boolean-item"
		>
			<Radio name={name} label={item.prompt.trueLabel ?? 'True'} value={1} onChange={onResponseChange} />
			<Radio name={name} label={item.prompt.falseLabel ?? 'False'} value={0} onChange={onResponseChange} />
		</ValidationAwareFormGroup>
	);
};
