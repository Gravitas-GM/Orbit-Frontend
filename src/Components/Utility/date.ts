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

export function formatRemainingTime(timeAsSeconds: number): string {
	const hours = Math.floor(timeAsSeconds / 3600);
	timeAsSeconds -= hours * 3600;

	const minutes = Math.floor(timeAsSeconds / 60);
	timeAsSeconds -= minutes * 60;

	return `${leftPad(hours, 2, '0')}:${leftPad(minutes, 2, '0')}:${leftPad(timeAsSeconds, 2, '0')}`;
}
