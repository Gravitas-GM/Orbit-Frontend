import * as React from 'react';
import {ucwords} from './Utility/string';

interface IProps {
	label: string;
}

export const SelectItemRenderer: React.FC<IProps> = (props) => {
	return (
		<>
			{ucwords(props.label)}
		</>
	);
};

SelectItemRenderer.displayName = 'SelectItemRenderer';
