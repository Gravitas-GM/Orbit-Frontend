import * as React from 'react';
import {BooleanItem} from './index';
import {H3, Radio} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';

interface Props {
	item: BooleanItem,
	validationFailures: ValidationFailures | null,
}

export const BooleanQuestion: React.FC<Props> = ({item, validationFailures}) => {
	const onResponseChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = !!parseInt(event.currentTarget.value, 10);
	}, [item]);

	const name = `item-${item.prompt}`;

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={name}
			failures={validationFailures}
			className="quiz-item boolean-item"
		>
			<Radio name={name} label={item.prompt.trueLabel ?? 'True'} value={1} onChange={onResponseChange} />
			<Radio name={name} label={item.prompt.falseLabel ?? 'False'} value={0} onChange={onResponseChange} />
		</ValidationAwareFormGroup>
	);
};
