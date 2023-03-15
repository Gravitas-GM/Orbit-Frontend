import { TypedAxiosInstance } from 'restyped-axios';
import { isAxiosErrorResponse } from '.';

export interface ErrorResponse {
	error: {
		code: number,
		reason: string,
		description: string,
	};
}

export function isErrorResponse(value: any): value is ErrorResponse {
	return typeof value === 'object' && 'error' in value;
}

export class ApiError extends Error {
	public readonly code: number;
	public readonly reason: string;

	public constructor(code: number, reason: string, description: string) {
		super(description);

		this.code = code;
		this.reason = reason;
	}

	public isNotFound(): boolean {
		return this.code === 404;
	}
}

export function attachResponseHandlers(client: TypedAxiosInstance<any>): void {
	client.interceptors.response.use(response => {
		if (isErrorResponse(response.data)) {
			const error = response.data.error;
			throw new ApiError(error.code, error.reason, error.description);
		}

		return response;
	}, error => {
		if (!isAxiosErrorResponse(error) || !error.response || !isErrorResponse(error.response.data))
			return Promise.reject(error);

		const data = error.response.data.error;
		return Promise.reject(new ApiError(data.code, data.reason, data.description));
	});
}
