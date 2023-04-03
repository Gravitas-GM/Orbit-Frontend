import {Intent, IToaster, IToastProps as BaseProps, Position, Toaster, ToasterPosition} from '@blueprintjs/core';
import { NextBoardResult } from './Api/Game-State/Models/Games';

const defaultToaster: IToaster = Toaster.create({
	position: Position.BOTTOM_RIGHT,
});


interface IToastProps extends BaseProps {
	position?: ToasterPosition;
}

export function show(props: IToastProps) {
	if (!!props.position) {
		const customToaster = Toaster.create({
			position: props.position
		})

		customToaster.show(props);

		return;
	}

	defaultToaster.show(props);
}

export function success(message: string, position?: ToasterPosition) {
	show(
		{
		intent: Intent.SUCCESS,
		message,
		position
		}, 
	);
}

export function info(message: string, position?: ToasterPosition) {
	show(
		{
			intent: Intent.PRIMARY,
			message,
			position
		},
	);
}

export function error(message: string, position?: ToasterPosition) {
	show(
		{
			intent: Intent.DANGER,
			message,
			position
		},
	);
}

export function warning(message: string, position?: ToasterPosition) {
	show(
		{
			intent: Intent.WARNING,
			message,
			position
		},
	);
}

// region Error Messages
export function showUnhandledErrorMessage(position?: ToasterPosition) {
	error('An error occurred while processing your request. Please try again.', position);
}

export function showValidationFailedErrorMessage(position?: ToasterPosition) {
	error('One or more fields did not pass validation.', position);
}


const nextBoardResultMessage = {
	[NextBoardResult.Success]: (position?: ToasterPosition) => success('Moved to next board.', position),
	[NextBoardResult.NoActiveGame]: (position?: ToasterPosition) => info('There is no active game.', position),
	[NextBoardResult.NoRemainingBoards]: (position?: ToasterPosition) => info('There are no boards remaining.', position),
	[NextBoardResult.BoardNotFound]: (position?: ToasterPosition) => error('Couldn\'t find the specified board.', position),
};

export function notifyNextBoardResult(result: NextBoardResult, position?: ToasterPosition) {
	nextBoardResultMessage[result](position);
}

// endregion
