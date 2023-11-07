import GraphemeSplitter from 'grapheme-splitter';
import {PlayerState} from '../../Api/Game-State/Models/Games';
import {User} from '../../Api/Hub/Models/Users';
import {QuestionKind} from '../../Api/Quiz/Models/Questions';

export function ucfirst(value: string) {
	if (!value.length)
		return value;

	return value.charAt(0).toUpperCase() + (value.length > 1 ? value.substr(1) : '');
}

export function ucwords(value: string, separator: string = ' ') {
	return value.split(separator).map(ucfirst).join(separator);
}

const numberFormatter = new Intl.NumberFormat();

export function formatNumber(number: number | null | undefined) {
	if (number === null || number === undefined)
		return null;

	return numberFormatter.format(number);
}

export function compareStrings(a: string, b: string) {
	return a.localeCompare(b, undefined, {sensitivity: 'base'});
}

export function renderUserName(user: User | null) {
	if (!user)
		return 'User';

	return `${ucwords(user.firstName ?? '')} ${ucwords(user.lastName ?? '')}`;
}

export function renderPlayerInitials(player: PlayerState) {
	const splitter = new GraphemeSplitter();

	const split = splitter.splitGraphemes(player.user_name);
	let initials = split[0];

	// loop backwards through the split to find the last name initial, to account for a name with multiple spaces
	for (let i = split.length - 1; i > 0; i--) {
		if (split[i] === ' ') {
			initials += split[i + 1];

			break;
		}
	}

	return initials;
}

export function leftPad(input: string|number, length: number, character: string = ' '): string {
	input = input.toString();

	if (input.length >= length)
		return input;

	if (character.length === 0)
		throw new Error('Padding character must not be empty');

	return character.charAt(0).repeat(length - input.length) + input;
}

export function renderKindLabel(kind: QuestionKind): string {
	if (kind === QuestionKind.Boolean)
		return ("True / False");

	return ucwords(kind);
}
