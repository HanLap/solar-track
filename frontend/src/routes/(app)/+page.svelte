<script lang="ts">
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import CurrentLoad from '$lib/components/CurrentLoad.svelte';
	import DayChart from '$lib/components/DayChart.svelte';
	import { parseDate } from '@internationalized/date';
	import { onMount } from 'svelte';

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
	<!-- <div class="flex flex-row justify-center gap-4">
			<Button href=".">Heute</Button>

			<DatePicker {date} on:valueChange={handleDateChange} class="w-40" />

			<Button href="/export" variant="outline">Daten Exportieren</Button>
		</div> -->

	{#await data.load then load}
		<CurrentLoad load={load ?? 0} ivmax={data.ivmax} />
	{/await}

	<div class="relative flex justify-center lg:flex-1">
		<DayChart {date} ivmax={data.ivmax} lines={data.lines} loading={data.loading} />
	</div>

	<!-- <form method="post" class="" use:enhance>
		<button type="submit" formaction="?/getInverters" class="btn btn-sm variant-filled-primary">
			get inverters
		</button>
	</form> -->
</div>
