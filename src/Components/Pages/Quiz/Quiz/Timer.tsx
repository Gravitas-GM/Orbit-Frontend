import * as React from 'react';
import {Icon, Intent, ProgressBar} from '@blueprintjs/core';
import {formatRemainingTime} from '../../../../utility/date';
import './Timer.scss';

type ExpirationFn = () => void;

interface Props {
	startTime: Date,
	endTime: Date | null,
	onExpired?: ExpirationFn,
}

export const Timer: React.FC<Props> = ({endTime, ...props}) => {
	if (endTime === null)
		return <div className="quiz-timer" />;

	return <Inner endTime={endTime} {...props} />;
};

interface InnerProps {
	startTime: Date,
	endTime: Date,
	onExpired?: ExpirationFn,
}

const Inner: React.FC<InnerProps> = ({startTime, endTime, onExpired}) => {
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
			setRemainingSeconds(Math.max(0, remaining));

			// It's important that we only submit when the timer goes negative:
			// 1) Because the zeroth second is technically the last full second the quiz is available, and submitting
			//    when the timer is zero means we submit a second early
			// 2) Due to #1, submitting when equal to zero, as opposed to afterwards, means that an automatically
			//    submitted quiz technically never times out because the frontend is submitting roughly a second early.
			if (remaining < 0) {
				window.clearInterval(timerRef.current);
				timerRef.current = undefined;

				onExpired?.();
			}
		}, 1000);

		return () => {
			if (timerRef.current !== null)
				window.clearInterval(timerRef.current);
		};
	}, [endTime, onExpired]);

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
	return Math.floor(diff / 1000);
}
