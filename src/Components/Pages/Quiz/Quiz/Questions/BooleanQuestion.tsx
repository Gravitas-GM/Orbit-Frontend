import * as React from 'react';
import {BooleanItem} from './index';
import {ControlGroup, H3, Radio} from '@blueprintjs/core';

interface Props {
	item: BooleanItem,
}

export const BooleanQuestion: React.FC<Props> = ({item}) => {
	const onResponseChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		item.answer = !!parseInt(event.currentTarget.value, 10);
	}, []);

	const name = `item-${item.prompt}`;

	return (
		<div>
			<H3>{item.prompt.prompt}</H3>

			<ControlGroup style={{gap: 10}}>
				<Radio name={name} label={item.prompt.trueLabel ?? 'True'} value={1} onChange={onResponseChange} />
				<Radio name={name} label={item.prompt.falseLabel ?? 'False'} value={0} onChange={onResponseChange} />
			</ControlGroup>
		</div>
	);
};
