import * as React from 'react';
import { Icon, Intent, Radio } from "@blueprintjs/core";
import { BooleanResponse } from "../../../../Api/Quiz/Models/QuizSubmissions";
import { IconSize } from "../../../../IconSize";

interface IProps {
	question: BooleanResponse;
	index: number;
}

export const BooleanAnswer: React.FC<IProps> = ({question, index}) => {

return (
		<div className="question">
			<div className="question-title">
				<Icon icon="help" size={IconSize.SMALL} />{index+1}. <span>{question.prompt}</span>
			</div>

			{
				question.correct ?
					<RenderCorrectAnswer question={question} index={index} />
					:
					<RenderWrongAnswer question={question} index={index} />
			}
		</div>
	);
};

const RenderCorrectAnswer: React.FC<IProps> = ({question, index}) => {
	return (
		<div className="question-results">
				<div className={'question-results-card'}>
					{
						question.response ?
							<Icon
								icon="tick"
								intent={Intent.SUCCESS}
							/>
							:
							<Icon icon="blank" />
					}

					<>
						<Radio
							style={{ marginBottom: 'unset' }}
							disabled={true}
							defaultChecked={question.response === true}
						/>

						<p>{question.trueLabel}</p>
					</>
				</div>

				<div className={'question-results-card'}>
					{
						!question.response ?
							<Icon
								icon="tick"
								intent={Intent.SUCCESS}
							/>
							:
							<Icon icon="blank" />
					}

					<>
						<Radio
							style={{ marginBottom: 'unset' }}
							disabled={true}
							defaultChecked={!question.response}
						/>

						<p>{question.falseLabel}</p>
					</>
				</div>
			</div>
	)
}

const RenderWrongAnswer: React.FC<IProps> = ({question, index}) => {
	return (
		<div className="question-results">
				<div className={'question-results-card'}>
					<Icon
						icon={ question.answer ? "tick" : "cross" }
						intent={question.answer ? Intent.SUCCESS : Intent.DANGER}
					/>

					<>
						<Radio
							style={{ marginBottom: 'unset' }}
							disabled={true}
							defaultChecked={question.response === true}
						/>

						<p>{question.trueLabel}</p>
					</>
				</div>

				<div className={'question-results-card'}>
					<Icon
						icon={!question.answer ? "tick" : "cross" }
						intent={!question.answer ? Intent.SUCCESS : Intent.DANGER}
					/>

					<>
						<Radio
							style={{ marginBottom: 'unset' }}
							disabled={true}
							defaultChecked={!question.response}
						/>

						<p>{question.falseLabel}</p>
					</>
				</div>
			</div>
	)
}
