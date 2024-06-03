import {FormGroup, H3, Icon, Intent, Radio} from '@blueprintjs/core';
import * as React from 'react';
import {MultipleChoiceResponse} from '../../../../Api/Quiz/Models/QuizSubmissions';

interface OptionProps extends Props {
	label: string,
	value: number,
}

function Option({item, value, ...props}: OptionProps): React.ReactElement {
	let icon: React.ReactNode = <Icon icon="blank" />;

	if (item.answerIndex === value)
		icon = <Icon intent={Intent.PRIMARY} icon="tick" />;
	else if (item.response === value)
		icon = <Icon intent={Intent.DANGER} icon="cross" />;

	return (
		<div className="choice">
			{icon}

			<Radio
				{...props}
				disabled={true}
				checked={value === item.response}
			/>
		</div>
	);
}

interface Props {
	item: MultipleChoiceResponse,
	name: string,
}

export function MultipleChoiceAnswer({item, name}: Props): React.ReactElement {
	return (
		<FormGroup label={<H3>{item.prompt}</H3>} labelFor={name} className="quiz-item multiple-choice-item">
			<div className="choices">
				{item.choices.map((text, index) => (
					<Option key={index} item={item} name={name} value={index} label={text} />
				))}
			</div>
		</FormGroup>
	);
}
