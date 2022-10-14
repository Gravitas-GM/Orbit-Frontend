import {Intent, IToastProps, Position, Toaster} from '@blueprintjs/core';

const toaster = Toaster.create({
	position: Position.BOTTOM_RIGHT,
});

export function show(props: IToastProps) {
	toaster.show(props);
}

export function success(message: string) {
	show({
		intent: Intent.SUCCESS,
		message,
	});
}

export function info(message: string) {
	show({
		intent: Intent.PRIMARY,
		message,
	});
}

export function error(message: string) {
	show({
		intent: Intent.DANGER,
		message,
	});
}

export function warning(message: string) {
	show({
		intent: Intent.WARNING,
		message,
	});
}

// region Error Messages
export function showUnhandledErrorMessage() {
	error('An error occurred while processing your request. Please try again.');
}

export function showValidationFailedErrorMessage() {
	error('One or more fields did not pass validation.');
}
// endregion
