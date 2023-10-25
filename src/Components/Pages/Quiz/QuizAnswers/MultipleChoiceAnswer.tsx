import * as React from 'react';
import {Icon, Intent, Radio} from '@blueprintjs/core';
import {MultipleChoiceResponse} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {IconSize} from '../../../../IconSize';

interface IProps {
	question: MultipleChoiceResponse;
	index: number;
}

export const MultipleChoiceAnswer: React.FC<IProps> = ({question, index}) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} />
				{index + 1}. <span>{question.prompt}</span>
			</div>

			<div className="question-results">
				{question.choices.map((choice, index) => (
					<div className="question-results-card" key={choice}>
						{question.answerIndex === index || (question.response === index && !question.correct) ? (
							<Icon
								icon={question.answerIndex === index ? 'tick' : 'cross'}
								intent={question.answerIndex === index ? Intent.SUCCESS : Intent.DANGER}
							/>
						) : (
							<Icon icon="blank" />
						)}

						<Radio
							style={{marginBottom: 'unset'}}
							disabled={true}
							defaultChecked={question.response === index}
						/>

						{choice}
					</div>
				))}
			</div>
		</div>
	);
};
