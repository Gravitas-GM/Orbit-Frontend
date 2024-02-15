import * as React from 'react';
import {BooleanResponse} from '../../../../../Api/Quiz/Models/QuizSubmissions';
import {FormGroup, H3, Icon, Intent, Radio} from '@blueprintjs/core';

interface OptionProps extends Props {
	label: string,
	value: boolean,
}

const Option: React.FC<OptionProps> = ({item, value, ...props}) => {
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
};

interface Props {
	item: BooleanResponse,
	name: string,
}

export const BooleanAnswer: React.FC<Props> = ({item, name}) => (
	<FormGroup label={<H3>{item.prompt}</H3>} labelFor={name} className="quiz-item boolean-item">
		<Option item={item} name={name} label={item.trueLabel} value={true} />
		<Option item={item} name={name} label={item.falseLabel} value={false} />
	</FormGroup>
);

BooleanAnswer.displayName = 'BooleanAnswer';
