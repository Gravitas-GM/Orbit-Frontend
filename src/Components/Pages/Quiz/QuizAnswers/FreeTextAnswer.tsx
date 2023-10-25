import * as React from 'react';
import {Icon, InputGroup, Intent} from '@blueprintjs/core';
import {FreeTextResponse} from '../../../../Api/Quiz/Models/QuizSubmissions';
import {IconSize} from '../../../../IconSize';
import {Spacing} from '../../../../Styles/variables';

interface IProps {
	question: FreeTextResponse;
	index: number;
}

export const FreeTextAnswer: React.FC<IProps> = ({question, index}) => {
	return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} />
				{index + 1}. <span>{question.prompt}</span>
			</div>

			<div className="question-results">
				{question.correct ? (
					<RenderCorrectAnswer question={question} index={index} />
				) : (
					<RenderWrongAnswer question={question} index={index} />
				)}
			</div>
		</div>
	);
};

const RenderWrongAnswer: React.FC<IProps> = ({question, index}) => {
	return (
		<>
			<span>Your Answer:</span>

			<div className="question-results-card">
				<Icon icon="cross" intent={Intent.DANGER} />

				<InputGroup disabled={true} defaultValue={question.response} style={{margin: Spacing.Small}} />
			</div>

			<span>Valid Answers:</span>

			{question.answers.map(answer => (
				<div key={answer} className="question-results-card">
					<Icon icon="blank" intent={Intent.SUCCESS} />

					<InputGroup disabled={true} defaultValue={answer} style={{margin: Spacing.Small}} />
				</div>
			))}
		</>
	);
};

const RenderCorrectAnswer: React.FC<IProps> = ({question}) => {
	return (
		<>
			<span>Your Answer:</span>

			<div className="question-results-card">
				<Icon icon="tick" intent={Intent.SUCCESS} />

				<InputGroup disabled={true} defaultValue={question.response} style={{margin: Spacing.Small}} />
			</div>
		</>
	);
};
