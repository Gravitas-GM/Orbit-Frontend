interface AxiosError {
	response?: {
		data: any;
		status: number;
		headers: any;
	};
	request?: XMLHttpRequest;
}

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

interface ValidationFailure {
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

export class ApiError<T extends {} = {}> extends Error {
	public readonly code: string;
	public readonly context: T;
	public readonly exceptions: ExceptionTrace[] | null;

	public constructor(code: string, message: string, context: T, exceptions?: ExceptionTrace[]) {
		super(message);

		this.code = code;
		this.context = context;
		this.exceptions = exceptions || null;
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

export function isAxiosErrorResponse(value: any): value is AxiosError {
	return typeof value === 'object' && ('response' in value || 'request' in value);
}
