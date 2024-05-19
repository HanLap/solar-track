<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation';
	import CurrentLoad from '$lib/components/CurrentLoad.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import DayChart from '$lib/components/DayChart.svelte';
	import { Button } from '$lib/ui/button/index.js';
	import { parseDate, type DateValue } from '@internationalized/date';
	import { onMount } from 'svelte';
	// import DayChart from '$lib/components/DayChart.svelte';

	// const { data } = $props();
	export let data;

	$: date = parseDate(data.day);

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

	<div class="relative flex lg:flex-1 justify-center">
		<DayChart {date} ivmax={data.ivmax} lines={data.lines} loading={data.loading} />
	</div>
	{#await data.load then load}
		<CurrentLoad load={load ?? 0} ivmax={data.ivmax} />
	{/await}

	<!-- <form method="post" class="" use:enhance>
		<button type="submit" formaction="?/getInverters" class="btn btn-sm variant-filled-primary">
			get inverters
		</button>
	</form> -->
</div>
