import {PlayerState} from '../../Api/Game-State/Models/Games';
import {User} from '../../Api/Hub/Models/Users';

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
	return player.user_name.split(' ').map(name => name[0]).join('');
}
