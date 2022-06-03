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
