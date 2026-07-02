import {H3} from '@blueprintjs/core';
import {ReactElement, useMemo} from 'react';
import {BaseChoiceQuestion} from '../../../../api/Survey';
import {ItemDefinition, RadialGraph} from '../../../../components/RadialGraph';

interface Props {
	question: BaseChoiceQuestion<true>,
}

export function ChoiceResponse({question}: Props): ReactElement {
	const frequencies = useMemo(() => {
		const summaryFrequencies = {...question.summary.frequencies};
		const summaryTotal = Object.values(summaryFrequencies).reduce((accum, value) => accum + value, 0);

		if (summaryTotal > 0 || question.responses.length === 0)
			return summaryFrequencies;

		return question.responses.reduce((accum, item) => {
			accum[item.response] = (accum[item.response] ?? 0) + 1;
			return accum;
		}, question.choices.reduce((accum, _, index) => {
			accum[index] = 0;
			return accum;
		}, {} as {[key: number]: number}));
	}, [question.choices, question.responses, question.summary.frequencies]);

	const segments = useMemo(() => {
		return Object.entries(frequencies).reduce((accum, [key, value]) => {
			accum.push({
				label: question.choices[parseInt(key, 10)] ?? `Choice #${key}`,
				value,
			});

			return accum;
		}, [] as ItemDefinition[]);
	}, [frequencies, question.choices]);

	return (
		<>
			<H3>{question.prompt}</H3>
			<RadialGraph segments={segments} />
		</>
	);
}
