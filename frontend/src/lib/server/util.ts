import type { LayoutParams as AppLayoutParams, RouteId as AppRouteId } from '$app/types';
import { fail, type RequestEvent } from '@sveltejs/kit';
import type { ZodTypeAny, infer as zInfer } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

type ParsedRequestEvent<
	Params extends AppLayoutParams<'/'> = AppLayoutParams<'/'>,
	RouteId extends AppRouteId | null = AppRouteId | null,
	Json = unknown
> = Omit<RequestEvent<Params, RouteId>, 'request'> & {
	request: Omit<Request, 'formData'>;
	json: Json;
};

type FormActionArgs<
	Schema extends ZodTypeAny,
	Params extends AppLayoutParams<'/'> = AppLayoutParams<'/'>,
	OutputData extends AnyRecord | void = AnyRecord | void,
	RouteId extends AppRouteId | null = AppRouteId | null
> = {
	schema: Schema;
	handler: ParsedAction<Params, OutputData, RouteId, zInfer<Schema>>;
};

export type ParsedAction<
	Params extends AppLayoutParams<'/'> = AppLayoutParams<'/'>,
	OutputData extends AnyRecord | void = AnyRecord | void,
	RouteId extends AppRouteId | null = AppRouteId | null,
	Json = unknown
> = (event: ParsedRequestEvent<Params, RouteId, Json>) => OutputData | Promise<OutputData>;

/**
 * Wrapper for sveltekit server actions that parses the form data
 * using the provided Zod schema and returns a 400 error with the validation errors.
 * parsed data is passed to the handler function as parameter `json`.
 *
 */
export const formAction = <
	Schema extends ZodTypeAny,
	Params extends AppLayoutParams<'/'> = AppLayoutParams<'/'>,
	OutputData extends AnyRecord | void = AnyRecord | void,
	RouteId extends AppRouteId | null = AppRouteId | null
>({
	schema,
	handler
}: FormActionArgs<Schema, Params, OutputData, RouteId>) => {
	return async (event: RequestEvent<Params, RouteId>) => {
		const result = await schema.safeParseAsync(await event.request.formData());

		if (!result.success) {
			return fail(400, { error: result.error.flatten() });
		}

		const json = result.data as zInfer<Schema>;

		return await handler({ ...event, json });
	};
};
