import {ReactElement, ReactNode, useCallback, useMemo, useState} from 'react';
import './index.scss';

export interface ItemDefinition {
	value: number,
	label?: string,
}

export type Item = number | ItemDefinition;

function toSum(items: Item[]): number {
	return items.reduce<number>((accum, item) => typeof item === 'number' ? accum + item : accum + item.value, 0);
}

interface Props {
	segments: Item[],
	size?: number,
}

type SegmentDefinition = ItemDefinition & {
	ratio: number,
	offset: number,
};

export function RadialGraph({segments, size = 400}: Props): ReactElement {
	const defs: SegmentDefinition[] = useMemo(() => {
		const items: ItemDefinition[] = segments.map(segment => {
			if (typeof segment === 'number')
				return {value: segment};
			else
				return segment;
		});

		const sum = items.reduce((accum, item) => accum + item.value, 0);

		return items.map((item, index) => ({
			...item,
			ratio: item.value / sum,
			offset: items.slice(0, index).reduce((accum, item) => accum + item.value / sum, 0),
		}));
	}, [segments]);

	const [label, setLabel] = useState('');

	const onSegmentMouseEnter = useCallback<EnterCallback>(label => setLabel(label), []);
	const onSegmentMouseLeave = useCallback(() => setLabel(''), []);

	return (
		<div style={{width: size}} className="radial-graph">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
				{defs.map((def, index) => (
					<Segment
						key={index}
						ratio={def.ratio}
						offset={def.offset}
						label={def.label ?? def.value.toString(10)}
						onMouseEnter={onSegmentMouseEnter}
						onMouseLeave={onSegmentMouseLeave}
					/>
				))}

				<text x={50} y={50} textAnchor="middle" dominantBaseline="middle">{label}</text>
			</svg>
		</div>
	);
}

type EnterCallback = (label: string) => void;

interface SegmentProps {
	ratio: number,
	offset: number,
	label: string,
	onMouseEnter?: (label: string) => void,
	onMouseLeave?: () => void,
	radius?: number,
	border?: number,
}

function Segment({
	ratio,
	offset,
	label,
	onMouseEnter,
	onMouseLeave,
	radius = 50,
	border = 10,
}: SegmentProps): ReactElement {
	const onEnter = useCallback(() => {
		onMouseEnter?.(label);
	}, [label, onMouseEnter]);

	const commands: string = useMemo(() => {
		const deg = ratio * 360;
		const long = deg > 180 ? 1 : 0;

		const innerRadius = radius - border;

		return [
			'M 100 50',
			`A 50 50 0 ${long} 0 ${getCoordFromDeg(deg, radius)}`,
			`L ${getCoordFromDeg(deg, innerRadius)}`,
			`A ${innerRadius} ${innerRadius} 0 ${long} 1 ${innerRadius + radius} ${radius}`,
		].join(' ');
	}, [ratio, radius, border]);

	return (
		<path
			className="segment"
			d={commands}
			transform={`rotate(${offset * -360})`}
			onMouseEnter={onEnter}
			onMouseLeave={onMouseLeave}
		/>
	);
}

function getCoordFromDeg(deg: number, radius: number): string {
	return `${Math.cos(deg * Math.PI / 180) * radius + 50} ${Math.sin(deg * Math.PI / 180) * -radius + 50}`;
}
