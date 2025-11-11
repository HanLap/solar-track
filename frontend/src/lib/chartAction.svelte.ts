import type { ApexOptions } from 'apexcharts';
import type { Attachment } from 'svelte/attachments';
import { setupApex } from './apexChart';

await setupApex();

export const chart = (options: () => ApexOptions): Attachment => {
	return (node) => {
		if (!globalThis.window?.ApexCharts) {
			return;
		}

		const myChart = new ApexCharts(node, options());
		myChart.render();

		$effect(() => {
			myChart.updateOptions(options());
		});

		return () => {
			myChart.destroy();
		};
	};
};
