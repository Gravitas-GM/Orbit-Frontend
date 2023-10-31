import {leftPad} from './string';

export function parseApiTimestamp(input: any): Date {
	if (typeof input === 'string')
		return new Date(input);
	else if (input instanceof Date)
		return input;

	console.error('Cannot convert input to Date: ', input);

	throw new Error(`Cannot convert input to Date`);
}

export function formatDate(input: Date) {
	return new Intl.DateTimeFormat('default', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(input);
}

export function formatDateTime(input: Date) {
	return new Intl.DateTimeFormat('default', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}).format(input);
}

export function formatRemainingTime(timeAsSeconds: number): string {
	const hours = Math.floor(timeAsSeconds / 3600);
	timeAsSeconds -= hours * 3600;

	const minutes = Math.floor(timeAsSeconds / 60);
	timeAsSeconds -= minutes * 60;

	return `${leftPad(hours, 2, '0')}:${leftPad(minutes, 2, '0')}:${leftPad(timeAsSeconds, 2, '0')}`;
}

export function formatDuration(start: Date, end: Date): string {
	const diff = end.getTime() - start.getTime();

	const seconds = Math.max(0, Math.floor(diff / 1000));

	return formatRemainingTime(seconds);
}
