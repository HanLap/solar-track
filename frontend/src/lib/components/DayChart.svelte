<script lang="ts">
	import { chart } from '$lib/chartAction.svelte';
	import { CalendarDate, ZonedDateTime } from '@internationalized/date';
	import type { ApexOptions } from 'apexcharts';
	import { mode } from 'mode-watcher';
	import { getOverview } from '../../routes/(app)/data.remote';

	interface Props {
		date: CalendarDate;
		data?: Awaited<ReturnType<typeof getOverview>>['overview'];
	}

	let { data, date }: Props = $props();

	const options = $derived({
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
		series: data?.lines ?? [],
		yaxis: {
			decimalsInFloat: 0,
			min: 0,
			max: data?.ivmax
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
	{#key mode.current}
		<div id="chart" {@attach chart(() => options)} class="w-full"></div>
	{/key}
</div>
