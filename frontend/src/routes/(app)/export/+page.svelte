<script lang="ts">
	import { enhance } from '$app/forms';
	import DateInput from '$lib/components/DateInput.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as datefns from 'date-fns';
	import { onMount } from 'svelte';
	import DndList from './DndList.svelte';
	import { ConicGradient } from '@skeletonlabs/skeleton';

	let downloadLink: HTMLAnchorElement;

	let start = new Date();
	let end = new Date();
	let dataRows: number | undefined = undefined;
	let fetchingRows: boolean = false;

	let all: { id: string; desc: string; example: string }[] = [
		{
			id: 'pdc',
			desc: 'PDC',
			example: '3123.0'
		},
		{
			id: 'kdy',
			desc: 'KDY',
			example: '70000.0'
		},
		{
			id: 'kt0',
			desc: 'KT0',
			example: '30000.0'
		},
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
	];

	let available: { id: string; desc: string; example: string }[] = [
		{
			id: 'pdc',
			desc: 'PDC',
			example: '3123.0'
		},
		{
			id: 'kdy',
			desc: 'KDY',
			example: '70000.0'
		},
		{
			id: 'kt0',
			desc: 'KT0',
			example: '30000.0'
		}
	];

	let selected: { id: string; desc: string; example: string }[] = [
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
	];

	function handleSelectedChanged(e: CustomEvent<{ items: typeof selected }>) {
		localStorage.setItem('export-format', JSON.stringify(e.detail.items));
	}

	const handleFormSubmit: SubmitFunction = () => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				const data = new Blob([result?.data?.csv], { type: 'text/csv' });
				const date = datefns.format(new Date(), 'yyyy-MM-dd_HH-mm-ss');

				downloadLink.download = `${date}-export.csv`;
				downloadLink.href = URL.createObjectURL(data);
				downloadLink.click();
			}

			update({ reset: false });
		};
	};

	onMount(() => {
		const stored = localStorage.getItem('export-format');

		if (stored) {
			selected = JSON.parse(stored);
			available = all.filter((item) => !selected.find((s) => s.id === item.id));
		}
		 
		handleFetchRows(start, end);
	});

	function handleStartChange(e: CustomEvent<Date>) {
		handleFetchRows(e.detail, end);
	}

	function handleEndChange(e: CustomEvent<Date>) {
		handleFetchRows(start, e.detail);
	}

	async function handleFetchRows(start: Date, end: Date) {
		try {
			fetchingRows = true;
			const startStr = datefns.format(start, 'yyyy-MM-dd');
			const endStr = datefns.format(end, 'yyyy-MM-dd');
			const res = await fetch(`/api/plant/${1}/count?start=${startStr}&end=${endStr}`);

			const data = await res.json();
			dataRows = data.count;
		} catch (e) {
			console.error(e);
		}
		fetchingRows = false;
	}
</script>

<!-- svelte-ignore a11y-missing-content -->
<!-- svelte-ignore a11y-missing-attribute -->
<a bind:this={downloadLink} class="hidden" download="export.csv" />

<form
	method="post"
	class="mx-auto my-8 flex flex-col gap-4 max-w-fit"
	use:enhance={handleFormSubmit}
>
	<h2 class="h2">Daten als CSV-Datei exportieren</h2>

	<h4 class="h4">Zeitraum:</h4>
	<div class="flex items-center gap-2">
		<DateInput name="start" bind:date={start} on:change={handleStartChange} />
		<span>-</span>
		<DateInput name="end" bind:date={end} on:change={handleEndChange} />
	</div>

	<div class="h-4 flex">
		{#if fetchingRows}
			<ConicGradient
				class="pl-10 h-4"
				width="w-4"
				stops={[
					{ color: 'transparent', start: 0, end: 25 },
					{ color: 'rgb(var(--color-primary-500))', start: 75, end: 100 }
				]}
				spin
			/>
		{/if}
		{#if dataRows !== undefined}
			<div class="text-sm text-gray-500">
				{dataRows} Datenpunkte
			</div>
		{/if}
	</div>

	<div>
		<h4 class="h4">Verfügbare Daten:</h4>
		<DndList bind:items={available} />
		<h4 class="h4">CSV Format:</h4>
		<DndList bind:items={selected} highlight on:change={handleSelectedChanged} />
	</div>

	<div>
		<h4 class="h4 mb-2">Beispiel Ausgabe:</h4>
		<div class="code p-2">
			{#each Array.from({ length: 3 }) as _}
				<div>
					{selected.map(({ example }) => example).join(',')}
				</div>
			{/each}
		</div>
	</div>

	<input type="hidden" name="format" value={selected.map(({ id }) => id).join(',')} />

	<button class="btn variant-filled-primary mt-10">Exportieren</button>
</form>
