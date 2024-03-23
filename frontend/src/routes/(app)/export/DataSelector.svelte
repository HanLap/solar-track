<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { DataItem } from './Data';
	import DndList from './DndList.svelte';
	import { Code } from '$lib/ui/code';
	import { Skeleton } from '$lib/ui/skeleton';
	import { fade } from 'svelte/transition';

	const eventDispatcher = createEventDispatcher();

	let all: DataItem[] = [
		{
			id: 'pdc',
			desc: 'PDC',
			example: '3123.0',
		},
		{
			id: 'kdy',
			desc: 'KDY',
			example: '70000.0',
		},
		{
			id: 'kt0',
			desc: 'KT0',
			example: '30000.0',
		},
		{
			id: 'date',
			desc: 'Datum',
			example: '2021-01-01 08:30:00',
		},
		{
			id: 'pac',
			desc: 'PAC',
			example: '6000.3',
		},
	];

	export let selected: DataItem[] = [
		{
			id: 'date',
			desc: 'Datum',
			example: '2021-01-01 08:30:00',
		},
		{
			id: 'pac',
			desc: 'PAC',
			example: '6000.3',
		},
	];

	let available: DataItem[] = [
		{
			id: 'pdc',
			desc: 'PDC',
			example: '3123.0',
		},
		{
			id: 'kdy',
			desc: 'KDY',
			example: '70000.0',
		},
		{
			id: 'kt0',
			desc: 'KT0',
			example: '30000.0',
		},
	];

	let mounted = false;

	onMount(() => {
		const stored = localStorage.getItem('export-format');

		if (stored) {
			selected = JSON.parse(stored);
			available = all.filter((item) => !selected.find((s) => s.id === item.id));
		}

		mounted = true;
	});

	function handleSelectedChanged(e: CustomEvent<{ items: DataItem[] }>) {
		const { items } = e.detail;

		localStorage.setItem('export-format', JSON.stringify(items));

		eventDispatcher('change', { items });
	}
</script>

<div>
	<h4 class="text-xl">Verfügbare Daten:</h4>
	<div class="relative h-12">
		{#if mounted}
			<DndList bind:items={available} />
		{:else}
			<div class="absolute inset-0" out:fade={{ duration: 300 }}>
				<Skeleton class="h-full" />
			</div>
		{/if}
	</div>
	<h4 class="text-xl">CSV Format:</h4>
	<div class="relative h-12">
		{#if mounted}
			<DndList bind:items={selected} highlight on:change={handleSelectedChanged} />
		{:else}
			<div class="absolute inset-0" out:fade={{ duration: 300 }}>
				<Skeleton class="h-full" />
			</div>
		{/if}
	</div>
</div>

<div>
	<h4 class="mb-2 text-xl">Beispiel Ausgabe:</h4>
	<Code>
		{selected.map(({ desc }) => desc).join(',')}
		{#each Array.from({ length: 3 }) as _}
			<div>
				{selected.map(({ example }) => example).join(',')}
			</div>
		{/each}
	</Code>
</div>
