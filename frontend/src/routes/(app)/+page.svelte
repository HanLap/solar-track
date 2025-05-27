<script lang="ts">
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import CurrentLoad from '$lib/components/CurrentLoad.svelte';
	import DayChart from '$lib/components/DayChart.svelte';
	import { parseDate } from '@internationalized/date';
	import { onMount } from 'svelte';
	import AdminPanel from './AdminPanel.svelte';

	let { data } = $props();

	let date = $derived(parseDate(data.day));

	beforeNavigate(({ from, to }) => {
		if (from?.url?.href === to?.url?.href) {
			return;
		}

		// data.loading = true;
		// data.lines = [];
	});

	onMount(() => {
		const refresh = setInterval(() => {
			invalidateAll();
		}, 1000 * 60);

		return () => {
			clearInterval(refresh);
		};
	});
</script>

<div class="flex h-full flex-1 flex-col gap-8 px-4 py-8 lg:px-20">
	<div class="h-16">
		{#await data.load then load}
			<CurrentLoad load={load ?? 0} ivmax={data.ivmax} />
		{/await}
	</div>

	<div class="relative flex justify-center lg:flex-1">
		<DayChart {date} ivmax={data.ivmax} lines={data.lines} loading={data.loading} />
	</div>

	<AdminPanel />
</div>
