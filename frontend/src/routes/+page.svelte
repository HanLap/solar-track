<script lang="ts">
	import { _adapters } from 'chart.js';
	import de from 'date-fns/locale/de/index.js';
	import { Line } from 'svelte-chartjs';
	import 'chartjs-adapter-date-fns';
	import { enhance } from '$app/forms';
	import {
		Chart as ChartJS,
		Colors,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		TimeScale,
		TimeSeriesScale
	} from 'chart.js';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

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

	export let data;

	_adapters._date.override({
		..._adapters._date,
		formats: function () {
			return {
				minute: 'HH:mm'
			};
		}
	});

	const chartdata = {
		labels: [],
		datasets: data.lines.map(({ name, data }) => ({
			label: name,
			fill: true,
			bezierCurve: true,
			lineTension: 0.3,
			pointRadius: 0,
			data
		}))
	};

	onMount(() => {
		const refresh = setInterval(() => {
			invalidateAll();
		}, 1000 * 60);

		return () => {
			clearInterval(refresh);
		};
	});
</script>

<div>
	<Line
		data={chartdata}
		options={{
			responsive: true,
			scales: {
				x: {
					type: 'time',
					time: {
						unit: 'minute'
					},
					adapters: {
						date: {
							locale: de
						}
					}
				},
				y: {
					display: true,
					beginAtZero: true,
					text: 'Watt',
					max: data.ivmax
				}
			}
		}}
	/>
</div>

<form method="post" use:enhance>
	<button type="submit" formaction="?/getInverters" class="btn variant-filled-primary">get inverters</button
	>
	<button type="submit" formaction="?/getMeasurement" class="btn variant-filled-primary"
		>get Measurement</button
	>
</form>
