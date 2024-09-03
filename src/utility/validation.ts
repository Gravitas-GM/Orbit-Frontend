import {ValidationFailure, ValidationFailures} from '../api/errors/symfony';

export function extract(failures: ValidationFailures, key: string, exact: boolean = true): ValidationFailure|null {
	if (key in failures)
		return failures[key];
	else if (!exact) {
		for (const itemKey in failures) {
			if (!failures.hasOwnProperty(itemKey))
				continue;

			if (itemKey.startsWith(key))
				return failures[itemKey];
		}
	}

	return null;
}
