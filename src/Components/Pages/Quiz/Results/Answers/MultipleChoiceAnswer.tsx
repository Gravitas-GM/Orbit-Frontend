import * as React from 'react';
import {MultipleChoiceResponse} from '../../../../../Api/Quiz/Models/QuizSubmissions';
import {FormGroup, H3, Icon, Intent, Radio} from '@blueprintjs/core';

interface OptionProps extends Props {
	label: string,
	value: number,
}

const Option: React.FC<OptionProps> = ({item, value, ...props}) => {
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
};

Option.displayName = 'MultipleChoiceAnswer.Option';

interface Props {
	item: MultipleChoiceResponse,
	name: string,
}

export const MultipleChoiceAnswer: React.FC<Props> = ({item, name}) => {
	return (
		<FormGroup label={<H3>{item.prompt}</H3>} labelFor={name} className="quiz-item multiple-choice-item">
			<div className="choices">
				{item.choices.map((text, index) => (
					<Option key={index} item={item} name={name} value={index} label={text} />
				))}
			</div>
		</FormGroup>
	);
};

MultipleChoiceAnswer.displayName = 'MultipleChoiceAnswer';
