<script lang="ts">
	import DatePicker from '$lib/components/DatePicker.svelte';
	import * as Card from '$lib/components/ui/card';
	import type { CalendarDate, DateValue } from '@internationalized/date';
	import RowCount from './RowCount.svelte';

	interface Props {
		start: CalendarDate;
		end: CalendarDate;
		fetchingRowCount: boolean;
		rowCount: number | undefined;
	}

	let { start = $bindable(), end = $bindable(), fetchingRowCount, rowCount }: Props = $props();

	function handleDayChange(value?: DateValue | undefined) {
		if (!value) return;

		start = end = value as CalendarDate;
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
			<DatePicker value={start} onValueChange={handleDayChange} />
		</div>
	</Card.Content>
	<Card.Footer>
		<RowCount fetching={fetchingRowCount} count={rowCount} />
	</Card.Footer>
</Card.Root>
