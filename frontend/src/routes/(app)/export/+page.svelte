<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { download } from '$lib/utils';
	import { today } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { DataItem } from './Data';
	import DataSelector from './DataSelector.svelte';
	import DayCard from './DayCard.svelte';
	import SpanCard from './SpanCard.svelte';

	const exportModes = {
		Day: { id: 'day', text: 'Tag' },
		Span: { id: 'dayspan', text: 'Zeitraum' }
	};
	let selectedTab = $state(exportModes.Day.id);

	let end = $state(today('UTC'));
	let start = $state(today('UTC'));

	const args = $derived({
		id: 1,
		start: start.toString(),
		end: end.toString()
	});

	let selectedCols: DataItem[] = $state([
		{
			id: 'date',
			desc: 'Datum',
			example: '2021-01-01 08:30:00'
		},
		{
			id: 'pac',
			desc: 'PAC',
			example: '6000.3'
		}
	]);

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

	function handleTabSwitch(value: string) {
		if (value === exportModes.Day.id) {
			start = end;
		} else {
			start = end.subtract({ days: 3 });
		}
	}
</script>

<div class="mx-auto max-w-[30rem] py-6">
	<h2 class="text-2xl">Daten als CSV-Datei exportieren</h2>
	<Tabs.Root bind:value={selectedTab} onValueChange={handleTabSwitch} class="w-full py-6">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value={exportModes.Day.id}>Tag</Tabs.Trigger>
			<Tabs.Trigger value={exportModes.Span.id}>Zeitraum</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value={exportModes.Day.id}>
			<DayCard bind:start bind:end />
		</Tabs.Content>
		<Tabs.Content value={exportModes.Span.id}>
			<SpanCard bind:start bind:end />
		</Tabs.Content>
	</Tabs.Root>

	<DataSelector bind:selected={selectedCols} />

	<form method="post" use:enhance={handleFormSubmit}>
		{#each selectedCols as col, index}
			<input type="hidden" name="format[{index}]" value={col.id} />
		{/each}
		<input type="date" name="start" value={start} hidden />
		<input type="date" name="end" value={end} hidden />

		<Button type="submit" class="mt-6">Exportieren</Button>
	</form>
</div>
