import {H3} from '@blueprintjs/core';
import {CSSProperties, ReactElement, useMemo} from 'react';
import {BaseScaleQuestion, Question} from '../../../../api/Survey';
import './ScaleResponse.scss';

interface Props {
	question: BaseScaleQuestion<true>,
}

export function ScaleResponse({question}: Props): ReactElement {
	const responseCounts = useMemo(() => {
		const counts: { [key: number]: number } = {};

		const start = question.startValue;
		const end = question.endValue;
		const step = question.stepAmount;

		for (let i = start; i !== end + step; i += step)
			counts[i] = 0;

		for (const item of question.responses)
			counts[item.response] += 1;

		return counts;
	}, [question]);

	return (
		<div className="survey-scale-response">
			<H3>{question.prompt}</H3>

			{Object.entries(responseCounts).map(([key, count]) => (
				<div key={key} className="bar-group">
					<div className="label">{question.labels?.[key] ?? key}</div>
					<Bar question={question} value={count} />
					<div className="value">{count}</div>
				</div>
			))}
		</div>
	);
}

interface BarProps {
	question: Question<true>,
	value: number,
}

function Bar({question, value}: BarProps): ReactElement {
	const styles: CSSProperties = {};

	if (question.summary.responseCount > 0)
		styles.width = `${value / question.summary.responseCount * 100}%`;
	else
		styles.visibility = 'hidden';

	return <div className="bar" style={styles} />;
}
