<script lang="ts">
	import DateRangePicker from '$lib/components/DateRangePicker.svelte';
	import * as Card from '$lib/components/ui/card';
	import type { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import RowCount from './RowCount.svelte';

	interface Props {
		start: CalendarDate;
		end: CalendarDate;
	}

	let { start = $bindable(), end = $bindable() }: Props = $props();

	function handleRangeChange(value: DateRange) {
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
			<DateRangePicker value={{ start, end }} onValueChange={handleRangeChange} />
			<RowCount {start} {end} />
		</div>
	</Card.Content>
</Card.Root>
