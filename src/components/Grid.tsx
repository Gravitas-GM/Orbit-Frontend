import {ReactElement, ReactNode} from 'react';
import {Spacing} from '../Styles/variables';

interface Props {
	children: ReactNode,
	columns: number,
	gap?: string | number,
}

export function Grid({children, columns, gap = Spacing.Large}: Props): ReactElement {
	return (
		<div
			className="gm-grid"
			style={{
				gap,
				gridTemplateColumns: `repeat(${columns}, calc(100% / ${columns}))`,
				display: 'grid',
			}}
		>
			{children}
		</div>
	);
}
