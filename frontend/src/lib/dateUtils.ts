import { parseDate, today, type CalendarDate } from '@internationalized/date';

export function parseDateWithFallback(date: string | undefined | null): CalendarDate {
	if (date) {
		try {
			return parseDate(date);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			return today('UTC');
		}
	} else {
		return today('UTC');
	}
}
