<script lang="ts">
	import { Code } from '$lib/components/ui/code';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { DataItem } from './Data';
	import DndList from './DndList.svelte';

	let all: DataItem[] = [
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

	interface Props {
		selected: DataItem[];
		onChange?: (items: DataItem[]) => void;
	}

	let {
		selected = $bindable(),

		onChange
	}: Props = $props();

	let available: DataItem[] = $state([
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
	]);

	let mounted = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('export-format');

		if (stored) {
			selected = JSON.parse(stored);
			available = all.filter((item) => !selected.find((s) => s.id === item.id));
		}

		mounted = true;
	});

	function handleSelectedChanged(items: DataItem[]) {
		localStorage.setItem('export-format', JSON.stringify(items));

		onChange?.(items);
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
			<DndList bind:items={selected} highlight onChange={handleSelectedChanged} />
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
		{#each Array.from({ length: 3 })}
			<div>
				{selected.map(({ example }) => example).join(',')}
			</div>
		{/each}
	</Code>
</div>
