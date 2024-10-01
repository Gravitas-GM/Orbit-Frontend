import {H3} from '@blueprintjs/core';
import {ReactElement} from 'react';
import {BaseChoiceQuestion} from '../../../../api/Survey';
import {RadialGraph} from '../../../../components/RadialGraph';

interface Props {
	question: BaseChoiceQuestion<true>,
}

export function ChoiceResponse({question}: Props): ReactElement {
	return (
		<>
			<H3>{question.prompt}</H3>
			<RadialGraph segments={[10, 15, 10]} />
		</>
	);
}
