<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/ui/button';
	import * as Tabs from '$lib/ui/tabs';
	import { download } from '$lib/utils';
	import { CalendarDate, today } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { DataItem } from './Data';
	import DataSelector from './DataSelector.svelte';
	import DayCard from './DayCard.svelte';
	import SpanCard from './SpanCard.svelte';

	const exportModes = {
		Day: { id: 'day', text: 'Tag' },
		Span: { id: 'dayspan', text: 'Zeitraum' },
	};
	let selectedTab = exportModes.Day.id;

	let end = today('UTC');
	let start = end.subtract({ days: 3 });
	let rowCount: number | undefined = undefined;
	let fetchingRowCount: boolean = false;

	let selectedCols: DataItem[] | undefined;

	$: {
		handleFetchRows(start, end);
	}

	const handleFormSubmit: SubmitFunction = () => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				let name = exportModes.Day.id ? `${start}-export.csv` : `${start}_${end}-export.csv`;
				const data = new Blob([result?.data?.csv], { type: 'text/csv' });

				download({ name, data });
			}

			update({ reset: false });
		};
	};

	async function handleFetchRows(start: CalendarDate, end: CalendarDate) {
		fetchingRowCount = true;
		try {
			const res = await fetch(`/api/plant/${1}/count?start=${start}&end=${end}`);

			const data = await res.json();
			rowCount = data.count;
		} catch (e) {
			console.error(e);
		}
		fetchingRowCount = false;
	}
</script>

<div class="mx-auto max-w-[30rem] py-6">
	<h2 class="text-2xl">Daten als CSV-Datei exportieren</h2>
	<Tabs.Root bind:value={selectedTab} class="w-full py-6">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value={exportModes.Day.id}>Tag</Tabs.Trigger>
			<Tabs.Trigger value={exportModes.Span.id}>Zeitraum</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value={exportModes.Day.id}>
			<DayCard bind:start bind:end {fetchingRowCount} {rowCount} />
		</Tabs.Content>
		<Tabs.Content value={exportModes.Span.id}>
			<SpanCard bind:start bind:end {fetchingRowCount} {rowCount} />
		</Tabs.Content>
	</Tabs.Root>

	<DataSelector bind:selected={selectedCols} />

	<form method="post" use:enhance={handleFormSubmit}>
		<input type="hidden" name="format" value={selectedCols?.map(({ id }) => id).join(',')} />
		<input type="date" name="start" value={start} hidden />
		<input type="date" name="end" value={end} hidden />

		<Button type="submit" class="mt-6">Exportieren</Button>
	</form>
</div>
