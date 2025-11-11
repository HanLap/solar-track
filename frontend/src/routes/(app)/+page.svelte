<script lang="ts">
	import { appState } from '$lib/appState.svelte';
	import CurrentLoad from '$lib/components/CurrentLoad.svelte';
	import DayChart from '$lib/components/DayChart.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { getOverview } from './data.remote';

	const state = $derived(appState());

	const date = $derived(state.date);
	const day = $derived(state.day);

	const query = $derived(getOverview(day));

	$effect(() => {
		day;
		const refresh = setInterval(() => {
			console.log('Refreshing data...', day ?? '');
			getOverview(day).refresh();
		}, 60_000);

		return () => {
			clearInterval(refresh);
		};
	});
</script>

<div class="flex h-full flex-1 flex-col gap-8 px-4 py-8 lg:px-20">
	{#if query.error}
		<div class="flex flex-1 flex-col items-center justify-start gap-8">
			<div class="text-red-500">Error loading data</div>
		</div>
	{:else if !query.ready || !query.current}
		<div class="flex flex-1 flex-col items-center justify-start gap-8">
			<Skeleton class="h-16 w-[40rem] max-w-full" />
			<Skeleton class="aspect-video w-full" />
		</div>
	{:else}
		{@const data = query.current}
		<div class="h-16">
			<CurrentLoad currentLoad={data.currentLoad} ivmax={data.overview.ivmax} />
		</div>

		<div class="relative flex justify-center lg:flex-1">
			<DayChart {date} data={data.overview} />
		</div>
	{/if}
</div>
