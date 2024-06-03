import {FormGroup, H3, Icon, Intent, Radio} from '@blueprintjs/core';
import * as React from 'react';
import {BooleanResponse} from '../../../../Api/Quiz/Models/QuizSubmissions';

interface OptionProps extends Props {
	label: string,
	value: boolean,
}

function Option({item, value, ...props}: OptionProps): React.ReactElement {
	let icon: React.ReactNode = <Icon icon="blank" />;

	if (item.answer === value)
		icon = <Icon intent={Intent.PRIMARY} icon="tick" />;

	return (
		<div className="option">
			{icon}

			<Radio
				{...props}
				disabled={true}
				checked={item.response === value}
			/>
		</div>
	);
}

interface Props {
	item: BooleanResponse,
	name: string,
}

export function BooleanAnswer({item, name}: Props): React.ReactElement {
	return (
		<FormGroup label={<H3>{item.prompt}</H3>} labelFor={name} className="quiz-item boolean-item">
			<Option item={item} name={name} label={item.trueLabel} value={true} />
			<Option item={item} name={name} label={item.falseLabel} value={false} />
		</FormGroup>
	);
}
