import {H3} from '@blueprintjs/core';
import {ReactElement, useMemo} from 'react';
import {BaseChoiceQuestion} from '../../../../api/Survey';
import {ItemDefinition, RadialGraph} from '../../../../components/RadialGraph';

interface Props {
	question: BaseChoiceQuestion<true>,
}

export function ChoiceResponse({question}: Props): ReactElement {
	const segments = useMemo(() => {
		return Object.entries(question.summary.frequencies).reduce((accum, [key, value]) => {
			accum.push({
				label: question.choices[parseInt(key, 10)] ?? `Choice #${key}`,
				value,
			});

			return accum;
		}, [] as ItemDefinition[]);
	}, [question.summary.frequencies]);

	return (
		<>
			<H3>{question.prompt}</H3>
			<RadialGraph segments={segments} />
		</>
	);
}
