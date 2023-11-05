<script lang="ts">
	import { enhance } from '$app/forms';
	import DateInput from '$lib/components/DateInput.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as datefns from 'date-fns';
	import { onMount } from 'svelte';
	import DndList from './DndList.svelte';
	import { ConicGradient } from '@skeletonlabs/skeleton';

	let downloadLink: HTMLAnchorElement;

	const exportModes = {
		Day: { id: 'day', text: 'Tag' },
		Span: { id: 'span', text: 'Zeitraum' }
	};
	let selectedExportMode = exportModes.Day;

	let start = new Date();
	let end = new Date();
	let dataRows: number | undefined = undefined;
	let fetchingRows: boolean = false;

	$: {
		console.log(start, end);
	}

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

				if (selectedExportMode === exportModes.Day) {
					const date = datefns.format(start, 'yyyy-MM-dd');
					downloadLink.download = `${date}-export.csv`;
				} else {
					const startDate = datefns.format(start, 'yyyy-MM-dd');
					const endDate = datefns.format(end, 'yyyy-MM-dd');
					downloadLink.download = `${startDate}_${endDate}-export.csv`;
				}

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

	function handleDayChange(e: CustomEvent<Date>) {
		start = e.detail;
		end = e.detail;
		handleFetchRows(e.detail, e.detail);
	}

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

<div class="mx-auto my-8 flex flex-col gap-4 max-w-fit">
	<h2 class="h2">Daten als CSV-Datei exportieren</h2>

	<div class="flex justify-center gap-1">
		{#each Object.values(exportModes) as mode}
			{@const selected = selectedExportMode === mode}
			<span
				class="chip bg-surface-700"
				class:variant-filled={selected}
				on:click={() => (selectedExportMode = mode)}
				on:keypress
			>
				{#if selected}
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							stroke="currentColor"
							class="h-4 text-surface-50-900-token"
							viewBox="0 0 24 24"
						>
							<title>check</title>
							<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
						</svg>
					</span>
				{/if}
				<span>{mode.text}</span>
			</span>
		{/each}
	</div>

	{#if selectedExportMode === exportModes.Day}
		<h4 class="h4">Tag:</h4>
		<div class="flex items-center gap-2">
			<DateInput date={start} on:change={handleDayChange} />
		</div>
	{:else if selectedExportMode === exportModes.Span}
		<h4 class="h4">Zeitraum:</h4>
		<div class="flex items-center gap-2">
			<DateInput bind:date={start} on:change={handleStartChange} />
			<span>-</span>
			<DateInput bind:date={end} on:change={handleEndChange} />
		</div>
	{/if}

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

	<form method="post" use:enhance={handleFormSubmit}>
		<DateInput name="start" date={start} hidden />
		<DateInput name="end" date={end} hidden />

		<input type="hidden" name="format" value={selected.map(({ id }) => id).join(',')} />

		<button class="btn variant-filled-primary mt-10">Exportieren</button>
	</form>
</div>
