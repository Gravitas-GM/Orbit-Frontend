import {ReactElement, useCallback, useMemo, useState} from 'react';
import './index.scss';
import {classNames} from '../../utility/dom';

export interface ItemDefinition {
	value: number,
	label: string,
}

export type Item = number | ItemDefinition;

interface Props {
	segments: Item[],
	size?: number,
}

type SegmentDefinition = ItemDefinition & {
	ratio: number,
	offset: number,
};

export function RadialGraph({segments, size = 400}: Props): ReactElement {
	const items = useMemo(() => {
		return segments.map(segment => {
			if (typeof segment === 'number')
				return {value: segment, label: segment.toString(10)};
			else
				return segment;
		});
	}, [segments]);

	const sum = useMemo(() => {
		return items.reduce((accum, item) => accum + item.value, 0);
	}, [items]);

	const defs: SegmentDefinition[] = useMemo(() => {
		return items.map((item, index) => ({
			...item,
			ratio: item.value / sum,
			offset: items.slice(0, index).reduce((accum, item) => accum + item.value / sum, 0),
		}));
	}, [items, sum]);

	const [currentSegment, setCurrentSegment] = useState<SegmentDefinition | null>(null);
	const [focused, setFocused] = useState(false);

	const onSegmentMouseEnter = useCallback<SegmentEventCallback>(def => {
		if (focused)
			return;

		setCurrentSegment(def);
	}, [focused]);

	const onSegmentMouseLeave = useCallback(() => {
		if (focused)
			return;

		setCurrentSegment(null);
	}, [focused]);

	const onSegmentClick = useCallback<SegmentEventCallback>(def => {
		if (!focused) {
			setCurrentSegment(def);
			setFocused(true);
		} else {
			setCurrentSegment(def !== currentSegment ? def : null);
			setFocused(def !== currentSegment);
		}
	}, [currentSegment, focused]);

	return (
		<div className="radial-graph">
			<div style={{width: size}}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					{defs.map((def, index) => (
						<Segment
							key={index}
							definition={def}
							active={currentSegment === def}
							onMouseEnter={onSegmentMouseEnter}
							onMouseLeave={onSegmentMouseLeave}
							onClick={onSegmentClick}
						/>
					))}

					{currentSegment && (
						<>
							<text className="focused-label" x={50} y={42}>
								{currentSegment.label}
							</text>

							<text className="focused-label" x={50} y={50}>
								{currentSegment.value} / {sum} employees
							</text>

							<text className="focused-label" x={50} y={57}>
								{Math.floor(currentSegment.ratio * 1000) / 10}%
							</text>
						</>
					)}
				</svg>
			</div>

			<div className="legend">
				{defs.map((def, index) => (
					<div key={index} className="legend-item">
						<div className="color" />
						{def.label}
					</div>
				))}
			</div>
		</div>
	);
}

type SegmentEventCallback = (def: SegmentDefinition) => void;

interface SegmentProps {
	definition: SegmentDefinition,
	active?: boolean,
	radius?: number,
	border?: number,
	onMouseEnter?: SegmentEventCallback,
	onMouseLeave?: SegmentEventCallback,
	onClick?: SegmentEventCallback,
}

function Segment({
	definition,
	active,
	onMouseEnter,
	onMouseLeave,
	onClick: onOuterClick,
	radius = 50,
	border = 10,
}: SegmentProps): ReactElement {
	const onEnter = useCallback(() => {
		onMouseEnter?.(definition);
	}, [onMouseEnter, definition]);

	const onLeave = useCallback(() => {
		onMouseLeave?.(definition);
	}, [onMouseLeave, definition]);

	const onClick = useCallback(() => {
		onOuterClick?.(definition);
	}, [onOuterClick, definition]);

	const commands: string = useMemo(() => {
		const start = definition.offset * 360;
		const end = start + definition.ratio * 360;
		const long = (end - start) > 180 ? 1 : 0;
		const innerRadius = radius - border;

		return [
			`M ${getCoordFromDeg(start, radius)}`,
			`A 50 50 0 ${long} 0 ${getCoordFromDeg(end, radius)}`,
			`L ${getCoordFromDeg(end, innerRadius)}`,
			`A ${innerRadius} ${innerRadius} 0 ${long} 1 ${getCoordFromDeg(start, innerRadius)}`,
		].join(' ');
	}, [definition, radius, border]);

	return (
		<path
			className={classNames('segment', active && 'active')}
			d={commands}
			onMouseEnter={onEnter}
			onMouseLeave={onLeave}
			onClick={onClick}
		/>
	);
}

function getCoordFromDeg(deg: number, radius: number): string {
	return `${Math.cos(deg * Math.PI / 180) * radius + 50} ${Math.sin(deg * Math.PI / 180) * -radius + 50}`;
}
