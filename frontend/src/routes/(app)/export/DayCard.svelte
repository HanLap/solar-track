<script lang="ts">
	import DatePicker from '$lib/components/DatePicker.svelte';
	import * as Card from '$lib/ui/card';
	import type { CalendarDate } from '@internationalized/date';
	import RowCount from './RowCount.svelte';

	export let start: CalendarDate;
	export let end: CalendarDate;
	export let fetchingRowCount: boolean;
	export let rowCount: number | undefined;

	function handleDayChange(e: CustomEvent<{ value?: CalendarDate }>) {
		const { value } = e.detail;

		if (!value) return;

		start = end = value;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Tag</Card.Title>
		<Card.Description>
			Erstellt eine CSV-Datei mit allen Datenpunkten des ausgewählten Tages.
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-2">
		<div class="flex items-center gap-2">
			<DatePicker date={start} on:valueChange={handleDayChange} />
		</div>
	</Card.Content>
	<Card.Footer>
		<RowCount fetching={fetchingRowCount} count={rowCount} />
	</Card.Footer>
</Card.Root>
