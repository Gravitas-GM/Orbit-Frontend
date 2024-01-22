import * as React from 'react';
import {QuestionResponse} from '../../../../../Api/Quiz/Models/QuizSubmissions';
import {Answer} from './Answer';
import './index.scss';

interface Props {
	items: QuestionResponse[],
}

export const Answers: React.FC<Props> = ({items}) => (
	<div id="quiz-form">
		{items.map((item, index) => (
			<Answer key={index} item={item} name={`questions[${index}]`} />
		))}
	</div>
);
