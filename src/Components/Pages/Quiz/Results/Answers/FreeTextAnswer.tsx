import * as React from 'react';
import {FreeTextResponse} from '../../../../../Api/Quiz/Models/QuizSubmissions';
import {FormGroup, H3, Icon, InputGroup, Intent} from '@blueprintjs/core';

interface Props {
	item: FreeTextResponse,
	name: string,
}

export const FreeTextAnswer: React.FC<Props> = ({item, name}) => {
	return (
		<FormGroup label={<H3>{item.prompt}</H3>} labelFor={name} className="quiz-item free-text-item">
			<div className="free-text-response">
				<Icon intent={item.correct ? Intent.PRIMARY : Intent.DANGER} icon={item.correct ? 'tick' : 'cross'} />

				<div style={{flexGrow: 1}}>
					<InputGroup disabled={true} value={item.response} />
				</div>
			</div>

			{!item.correct && (
				<div className="accepted-answers">
					<strong>Accepted Answers:</strong>
					<ul>
						{item.answers.map((answer, index) => (
							<li key={index}>{answer}</li>
						))}
					</ul>
				</div>
			)}
		</FormGroup>
	);
};

FreeTextAnswer.displayName = 'FreeTextAnswer';
