import { page } from '$app/state';
import { parseDate, today } from '@internationalized/date';

export const appState = () => {
	const day = $derived(page.url.searchParams.get('day'));
	const date = $derived(day ? parseDate(day) : today('UTC'));

	return {
		get day() {
			return day;
		},
		get date() {
			return date;
		}
	};
};
