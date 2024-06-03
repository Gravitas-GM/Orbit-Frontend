import {H3, InputGroup} from '@blueprintjs/core';
import * as React from 'react';
import {ValidationFailures} from '../../../../Api/errors/symfony';
import {ValidationAwareFormGroup} from '../../../../Components/ValidationAwareFormGroup';
import {FreeTextItem} from './index';

interface Props {
	name: string,
	item: FreeTextItem,
	validationFailures: ValidationFailures | null,
}

export function FreeTextQuestion({name, item, validationFailures}: Props): React.ReactElement {
	const [answer, setAnswer] = React.useState(item.answer);

	const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = event.currentTarget.value || null;
		setAnswer(event.currentTarget.value);
	}, []);

	return (
		<ValidationAwareFormGroup
			label={<H3>{item.prompt.prompt}</H3>}
			labelFor={`${name}.answer`}
			failures={validationFailures}
			failureMessage="This question has not been answered."
			className={`quiz-item free-text-item question-${item.prompt.id}`}
		>
			<InputGroup
				name={`item-${item.prompt.id}`}
				value={answer ?? ''}
				onChange={onChange}
			/>
		</ValidationAwareFormGroup>
	);
}
