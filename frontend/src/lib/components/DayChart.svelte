<script lang="ts">
	import { chart } from '$lib/chartAction';
	import { Progress } from '$lib/components/ui/progress';
	import { CalendarDate, ZonedDateTime } from '@internationalized/date';
	import type { ApexOptions } from 'apexcharts';
	import { mode } from 'mode-watcher';

	interface Props {
		ivmax: number;
		date: CalendarDate;
		lines: { name: string; data: { x: string; y: number }[] }[];
		loading: boolean;
	}

	let { ivmax, date, lines, loading }: Props = $props();

	let options = $derived({
		chart: {
			type: 'line',
			animations: {
				enabled: false
			},
			toolbar: {
				show: false
			},
			background: 'transparent'
		},
		series: lines,
		yaxis: {
			decimalsInFloat: 0,
			min: 0,
			max: ivmax
		},
		xaxis: {
			type: 'datetime',
			min: new ZonedDateTime(date.year, date.month, date.day, 'de-DE', 0, 3).toDate().getTime(),
			max: new ZonedDateTime(date.year, date.month, date.day, 'de-DE', 0, 23).toDate().getTime(),
			labels: {
				format: 'HH:mm'
			}
		},
		theme: {
			mode: mode.current,
			palette: 'palette4'
		}
	} satisfies ApexOptions);
</script>

<div class="max-w-screen relative flex max-h-full w-[70rem] justify-center">
	{#if loading}
		<div class="absolute flex h-full w-full items-center p-20 backdrop-blur-sm">
			<Progress />
		</div>
	{/if}
	{#key mode.current}
		<div use:chart={options} class="w-full"></div>
	{/key}
</div>
