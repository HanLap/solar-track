import { getRequestEvent } from '$app/server';

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public response: Response
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export async function api<TData>(...args: Parameters<typeof fetch>) {
	const { fetch } = getRequestEvent();

	const [path, options] = args;
	const response = await fetch(path, {
		...options,
		headers: {
			...(options?.headers ?? {}),
			'content-type': 'application/json'
		}
	});

	if (response.status < 200 || response.status >= 300) {
		throw new ApiError(
			`API request failed with status ${response.status}`,
			response.status,
			response
		);
	}

	return (await response.json()) as TData;
}
