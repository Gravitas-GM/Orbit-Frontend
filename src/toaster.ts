import {Intent, IToastProps, Position, Toaster} from '@blueprintjs/core';
import {NextBoardResult} from './api/Game-State/Models/Games';

export namespace toaster {
	const toaster = Toaster.create({
		position: Position.BOTTOM_LEFT,
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

	const nextBoardResultMessage = {
		[NextBoardResult.Success]: () => success('Moved to next board.'),
		[NextBoardResult.NoActiveGame]: () => info('There is no active game.'),
		[NextBoardResult.NoRemainingBoards]: () => info('There are no boards remaining.'),
		[NextBoardResult.BoardNotFound]: () => error('Couldn\'t find the specified board.'),
	};

	export function notifyNextBoardResult(result: NextBoardResult) {
		nextBoardResultMessage[result]();
	}

	// region Error Messages

	export function showUnhandledErrorMessage() {
		error('An error occurred while processing your request. Please try again.');
	}

	export function showValidationFailedErrorMessage() {
		error('One or more fields did not pass validation.');
	}

	// endregion
}
