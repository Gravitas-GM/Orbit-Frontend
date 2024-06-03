import {H3, Radio} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../../../../Api/errors/symfony';
import {ValidationAwareFormGroup} from '../../../../Components/ValidationAwareFormGroup';
import {BooleanItem} from './index';

interface Props {
	name: string,
	item: BooleanItem,
	validationFailures: ValidationFailures | null,
}

export function BooleanQuestion({name, item, validationFailures}: Props): React.ReactElement {
	const onResponseChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = !!parseInt(event.currentTarget.value, 10);
	}, [item]);

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={`${name}.answer`}
			failures={validationFailures}
			failureMessage="This question has not been answered."
			className={`quiz-item boolean-item question-${item.prompt.id}`}
		>
			<Radio name={name} label={item.prompt.trueLabel ?? 'True'} value={1} onChange={onResponseChange} />
			<Radio name={name} label={item.prompt.falseLabel ?? 'False'} value={0} onChange={onResponseChange} />
		</ValidationAwareFormGroup>
	);
}
