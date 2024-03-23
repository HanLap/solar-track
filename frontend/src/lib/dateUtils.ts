import { parseDate, type CalendarDate, today } from '@internationalized/date';

export function parseDateWithFallback(date: string | undefined | null): CalendarDate {
	if (date) {
		try {
			return parseDate(date);
		} catch (e) {
			return today('UTC');
		}
	} else {
		return today('UTC');
	}
}
