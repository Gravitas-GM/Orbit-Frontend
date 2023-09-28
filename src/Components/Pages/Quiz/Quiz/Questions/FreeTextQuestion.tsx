import * as React from 'react';
import {FreeTextItem} from './index';
import {ControlGroup, H3, InputGroup} from '@blueprintjs/core';

interface Props {
	item: FreeTextItem,
	onChange: (item: FreeTextItem) => void,
}

export const FreeTextQuestion: React.FC<Props> = ({item, onChange}) => {
	return (
		<div>
			<H3>{item.prompt.prompt}</H3>

			<ControlGroup fill={true}>
				<InputGroup
					name={`answer-${item.prompt.id}`}

				/>
			</ControlGroup>
		</div>
	);
};
