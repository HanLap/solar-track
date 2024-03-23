export const prerender = false;

export async function load({ url }) {
	return {
		header: {
			pathname: url.pathname,
		},
	};
}
