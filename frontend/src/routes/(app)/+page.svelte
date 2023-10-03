<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation';
	import DateInput from '$lib/components/DateInput.svelte';
	import DayChart from '$lib/components/DayChart.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import * as datefns from 'date-fns';
	import { onMount } from 'svelte';

	export let data;

	$: day = datefns.parse(data.day, 'yyyy-MM-dd', new Date());

	function handleDayChange(event: CustomEvent<Date>) {
		goto(`?day=${datefns.format(event.detail, 'yyyy-MM-dd')}`);
	}

	beforeNavigate(({from, to}) => {
		if (from?.url?.href === to?.url?.href) {
			return;
		}

		data.loading = true;
		data.lines = [];
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
<div class="h-full w-full flex">
<div class="flex-1 flex flex-col gap-8 px-0 lg:px-20 py-8">
	<div class="flex flex-row justify-center gap-4">
		<a href="." class="btn btn-sm variant-filled-primary">Heute</a>

		<DateInput date={day} on:change={handleDayChange} arrows />

		<a href="/export" class="btn btn-sm variant-ghost-primary">Daten Exportieren</a>
	</div>

	<div class="flex-1 relative flex justify-center">
		<DayChart {day} ivmax={data.ivmax} lines={data.lines} loading={data.loading} />
	</div>
	<div class="w-full flex flex-col items-center justify-center gap-2">
		<div class="max-w-full w-[40rem]">
			<div class="flex justify-between px-4 py-1">
				<span> Momentane Auslastung: </span>

				<span>{Math.round(((data.load ?? 0) / data.ivmax) * 100)}%</span>
			</div>
			<ProgressBar
				label="Progress Bar"
				value={data.load ?? 0}
				max={data.ivmax}
				meter="bg-primary-600-300-token"
				track="bg-primary-300-600-token"
			/>
		</div>
	</div>

	<!-- <form method="post" class="" use:enhance>
		<button type="submit" formaction="?/getInverters" class="btn btn-sm variant-filled-primary">
			get inverters
		</button>
	</form> -->
</div>

</div>