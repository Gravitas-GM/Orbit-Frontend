import {H3} from '@blueprintjs/core';
import {CSSProperties, ReactElement, useMemo} from 'react';
import {BaseScaleQuestion, Question} from '../../../../api/Survey';
import {ItemDefinition, RadialGraph} from '../../../../components/RadialGraph';

interface Props {
	question: BaseScaleQuestion<true>,
}

export function ScaleResponse({question}: Props): ReactElement {
	const segments: ItemDefinition[] = useMemo(() => {
		return Object.entries(question.summary.frequencies).reduce((accum, [key, value]) => {
			accum.push({
				label: question.labels?.[key] ?? key,
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
