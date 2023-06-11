<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import {
		CategoryScale,
		Chart as ChartJS,
		Colors,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		TimeScale,
		TimeSeriesScale,
		Title,
		Tooltip,
		_adapters
	} from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import * as datefns from 'date-fns';
	import de from 'date-fns/locale/de/index.js';
	import { Line } from 'svelte-chartjs';

	ChartJS.register(
		Title,
		Colors,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		TimeScale,
		TimeSeriesScale
	);

	export let ivmax: number;
	export let day: Date;
	export let lines: { name: string; data: { x: string; y: number }[] }[];

	_adapters._date.override({
		..._adapters._date,
		formats: function () {
			return {
				minute: 'HH:mm',
				hour: 'HH:mm'
			};
		}
	});

	$: chartdata = {
		datasets: lines.map(({ name, data }) => ({
			label: name,
			fill: true,
			bezierCurve: true,
			lineTension: 0,
			pointRadius: 0,
			data
		}))
	};

	let loading = true;
</script>

{#if loading}
	<ProgressBar meter="bg-primary-500" track="bf-primary-500/30" />
{/if}
<div>
	<Line
		data={chartdata}
		options={{
			animation: {
				
				onComplete: () => {
					loading = false;
				}
			},
			spanGaps: 1000 * 60 * 60, // 1 hour
			responsive: true,
			scales: {
				x: {
					type: 'time',
					time: {
						unit: 'hour'
					},
					adapters: {
						date: {
							locale: de
						}
					},
					bounds: 'ticks',
					ticks: {
						stepSize: 1,
						autoSkip: true,
						maxRotation: 0,
						major: {
							enabled: true
						}
					},
					min: datefns.format(datefns.set(day, { hours: 5 }), 'yyyy-MM-dd HH:mm:ss'),
					max: datefns.format(datefns.set(day, { hours: 23 }), 'yyyy-MM-dd HH:mm:ss')
				},
				y: {
					display: true,
					beginAtZero: true,
					title: {
						display: true,
						text: 'Watt'
					},
					max: ivmax
				}
			}
		}}
	/>
</div>
