import * as React from 'react';
import {MultipleChoiceItem} from './index';
import {H3} from '@blueprintjs/core';

interface Props {
	item: MultipleChoiceItem,
	onChange: (item: MultipleChoiceItem) => void,
}

export const MultipleChoiceQuestion: React.FC<Props> = ({item, onChange}) => (
	<div>
		<H3>{item.prompt.prompt}</H3>
	</div>
);
