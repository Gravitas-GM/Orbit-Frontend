import {TypedAxiosInstance} from 'restyped-axios';
import {isAxiosErrorResponse} from '.';

interface StackTraceItem {
	namespace: string;
	short_class: string;
	class: string;
	type: string;
	function: string;
	file: string;
	line: number;
}

interface ExceptionTrace {
	message: string;
	class: string;
	trace: StackTraceItem[];
}

interface ErrorResponse<Context extends object = {}> {
	error: {
		code: string;
		message: string;
		exceptions?: ExceptionTrace[];
		context?: Context;
	};
}

export interface ValidationFailure {
	code: string;
	path: string;
	message: string;
}

export interface ValidationFailures {
	[key: string]: ValidationFailure;
}

interface ValidationFailureContext {
	failures: ValidationFailures;
}

export const ErrorCodes = {
	Validation: 'validation_failed',
	AccessDenied: 'access_denied',
	NotFound: 'not_found',
	QuizNotReady: 'quiz.not_ready',
};

export class ApiError<Context extends {} = {}> extends Error {
	public readonly code: string;
	public readonly context: Context;
	public readonly exceptions: ExceptionTrace[] | null;

	public constructor(code: string, message: string, context: Context, exceptions?: ExceptionTrace[]) {
		super(message);

		this.code = code;
		this.context = context;
		this.exceptions = exceptions || null;
	}

	public isValidationFailure(): this is ApiError<ValidationFailureContext> {
		return this.code === ErrorCodes.Validation;
	}

	public isAccessDenied(): boolean {
		return this.code === ErrorCodes.AccessDenied;
	}

	public isNotFound(): boolean {
		return this.code === ErrorCodes.NotFound;
	}

	public isQuizNotReady(): boolean {
		return this.code === ErrorCodes.QuizNotReady;
	}
}

export function isValidationFailureError(value: any): value is ApiError<ValidationFailureContext> {
	return value instanceof ApiError && value.code === 'validation_failed';
}

export function isAccessDeniedError(value: any): value is ApiError {
	return value instanceof ApiError && value.code === 'access_denied';
}

export function isApiErrorResponse(value: any): value is ErrorResponse {
	return typeof value === 'object' && 'error' in value;
}

/**
 * Attaches response handlers appropriate for our usual Symfony API responses. Responses that contain
 * errors, regardless of the HTTP status code, will be converted into `ApiError` types and thrown.
 */
export function attachResponseHandlers(client: TypedAxiosInstance): void {
	client.interceptors.response.use(response => {
		if (isApiErrorResponse(response.data)) {
			const error = response.data.error;

			throw new ApiError(error.code, error.message, error.context ?? {}, error.exceptions);
		}

		return response;
	}, error => {
		if (!isAxiosErrorResponse(error) || !error.response || !isApiErrorResponse(error.response.data))
			throw error;

		const data = error.response.data.error;

		throw new ApiError(data.code, data.message, data.context ?? {}, data.exceptions);
	});
}
