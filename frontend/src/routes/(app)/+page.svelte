<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import DateInput from '$lib/components/DateInput.svelte';
	import DayChart from '$lib/components/DayChart.svelte';
	import * as datefns from 'date-fns';
	import { onMount } from 'svelte';

	export let data;

	$: day = datefns.parse(data.day, 'yyyy-MM-dd', new Date());

	function handleDayChange(event: CustomEvent<Date>) {
		goto(`?day=${datefns.format(event.detail, 'yyyy-MM-dd')}`);
	}

	onMount(() => {
		const refresh = setInterval(() => {
			invalidateAll();
		}, 1000 * 60);

		return () => {
			clearInterval(refresh);
		};
	});
</script>

<div class="flex flex-col h-screen max-h-screen gap-4 px-0 :px-20 py-8 ">
	<div class="flex flex-row justify-center gap-4">
		<a href="." class="btn btn-sm variant-filled-primary">Heute</a>

		<DateInput date={day} on:change={handleDayChange} />
	</div>

	<div class="flex-1 p-4 relative flex justify-center">
		<DayChart {day} ivmax={data.ivmax} lines={data.lines} />
	</div>

	<form method="post" class="" use:enhance>
		<button type="submit" formaction="?/getInverters" class="btn btn-sm variant-filled-primary">
			get inverters
		</button>
		<button type="submit" formaction="?/getMeasurement" class="btn btn-sm variant-filled-primary">
			get Measurement
		</button>
	</form>
</div>
