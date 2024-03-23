<script lang="ts">
	import DateRangePicker from '$lib/components/DateRangePicker.svelte';
	import * as Card from '$lib/ui/card';
	import type { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import RowCount from './RowCount.svelte';

	export let start: CalendarDate;
	export let end: CalendarDate;
	export let fetchingRowCount: boolean;
	export let rowCount: number | undefined;

	function handleRangeChange(e: CustomEvent<{ value: DateRange }>) {
		const { value } = e.detail;

		if (!value.start || !value.end) return;

		start = value.start as CalendarDate;
		end = value.end as CalendarDate;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Zeitraum</Card.Title>
		<Card.Description>
			Erstellt eine CSV-Datei mit allen Datenpunkten im ausgewählten Zeitraum.
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-2">
		<div class="flex items-center gap-2">
			<DateRangePicker value={{ start, end }} on:valueChange={handleRangeChange} />
		</div>
	</Card.Content>
	<Card.Footer>
		<RowCount count={rowCount} fetching={fetchingRowCount} />
	</Card.Footer>
</Card.Root>
