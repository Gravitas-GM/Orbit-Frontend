import * as React from 'react';
import {FreeTextItem} from './index';
import {H3, InputGroup} from '@blueprintjs/core';
import {ValidationAwareFormGroup} from '../../../../ValidationAwareFormGroup';
import {ValidationFailures} from '../../../../../Api/errors/symfony';

interface Props {
	name: string,
	item: FreeTextItem,
	validationFailures: ValidationFailures | null,
}

export const FreeTextQuestion: React.FC<Props> = ({name, item, validationFailures}) => {
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
			className="quiz-item free-text-item"
		>
			<InputGroup
				name={`item-${item.prompt.id}`}
				value={answer ?? ''}
				onChange={onChange}
			/>
		</ValidationAwareFormGroup>
	);
};
