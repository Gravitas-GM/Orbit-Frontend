import * as React from 'react';
import {QuestionResponse} from '../../../../api/Quiz/Models/QuizSubmissions';
import {Answer} from './Answer';
import './index.scss';

interface Props {
	items: QuestionResponse[],
}

export function Answers({items}: Props): React.ReactElement {
	return (
		<div id="quiz-form">
			{items.map((item, index) => (
				<Answer key={index} item={item} name={`questions[${index}]`} />
			))}
		</div>
	);
}
