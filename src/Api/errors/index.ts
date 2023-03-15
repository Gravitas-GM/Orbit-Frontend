export interface AxiosError {
	response?: {
		data: unknown;
		status: number;
		headers: unknown;
	};
	request?: XMLHttpRequest;
}

export function isAxiosErrorResponse(value: any): value is AxiosError {
	return typeof value === 'object' && ('response' in value || 'request' in value);
}
