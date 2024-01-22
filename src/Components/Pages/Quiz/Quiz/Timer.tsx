import * as React from 'react';
import {Icon, Intent, ProgressBar} from '@blueprintjs/core';
import {formatRemainingTime} from '../../../Utility/date';
import './Timer.scss';

interface Props {
	startTime: Date,
	endTime: Date | null,
}

export const Timer: React.FC<Props> = ({startTime, endTime}) => {
	if (endTime === null)
		return <div className="quiz-timer" />;

	return <Inner startTime={startTime} endTime={endTime} />;
};

interface InnerProps {
	startTime: Date,
	endTime: Date,
}

const Inner: React.FC<InnerProps> = ({startTime, endTime}) => {
	const [duration, setDuration] = React.useState(0);
	const [remainingSeconds, setRemainingSeconds] = React.useState(() => toRemainingSeconds(endTime));

	// Keeps duration in sync with startTime and endTime props
	React.useEffect(() => {
		setDuration(toRemainingSeconds(endTime, startTime));
	}, [startTime, endTime]);

	const timerRef = React.useRef<number>();

	// Handles ticking down the remaining time once per second.
	React.useEffect(() => {
		timerRef.current = window.setInterval(() => {
			const remaining = toRemainingSeconds(endTime);
			setRemainingSeconds(remaining);

			if (remaining <= 0) {
				window.clearInterval(timerRef.current);
				timerRef.current = undefined;
			}
		}, 1000);

		return () => {
			if (timerRef.current !== null)
				window.clearInterval(timerRef.current);
		};
	}, [endTime]);

	return (
		<div className="quiz-timer">
			<strong><Icon icon="time" /> Time Remaining: </strong>
			<span>{formatRemainingTime(remainingSeconds)}</span>

			<ProgressBar intent={Intent.WARNING} value={remainingSeconds / duration} />
		</div>
	);
};

function toRemainingSeconds(date: Date, base?: Date): number {
	const diff = date.getTime() - (base?.getTime() ?? Date.now());
	return Math.max(0, Math.floor(diff / 1000));
}
