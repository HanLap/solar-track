<script lang="ts">
	import { chart } from '$lib/chartAction';
	import { Progress } from '$lib/ui/progress';
	import { mode } from 'mode-watcher';
	import { CalendarDate, DateFormatter, ZonedDateTime } from '@internationalized/date';
	import type { ApexOptions } from 'apexcharts';

	const df = new DateFormatter('de-DE', {
		hour: '2-digit',
		minute: '2-digit',
	});

	export let ivmax: number;
	export let date: CalendarDate;
	export let lines: { name: string; data: { x: string; y: number }[] }[];
	export let loading: boolean;

	$: options = {
		chart: {
			type: 'line',
			animations: {
				enabled: false,
			},
			toolbar: {
				show: false,
			},
			background: 'transparent',
		},
		series: lines,
		yaxis: {
			decimalsInFloat: 0,
			min: 0,
			max: ivmax,
		},
		xaxis: {
			type: 'datetime',
			min: new ZonedDateTime(date.year, date.month, date.day, 'de-DE', 0, 3).toDate().getTime(),
			max: new ZonedDateTime(date.year, date.month, date.day, 'de-DE', 0, 23).toDate().getTime(),
			labels: {
				format: 'HH:mm',
			},
		},
		theme: {
			mode: $mode,
			palette: 'palette4',
		},
	} satisfies ApexOptions;
</script>

<div class="relative max-h-full w-[70rem] max-w-full">
	{#if loading}
		<div class="absolute flex h-full w-full items-center p-20 backdrop-blur">
			<Progress />
		</div>
	{/if}
	{#key $mode}
		<div use:chart={options} />
	{/key}
</div>
