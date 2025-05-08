import type { ApexOptions } from 'apexcharts';

if (globalThis.window) {
	globalThis.window.ApexCharts = (await import('apexcharts')).default;
}

export const chart = (node: HTMLElement, options: ApexOptions) => {
	const myChart = new ApexCharts(node, options);
	myChart.render();

	return {
		update(options: ApexOptions) {
			myChart.updateOptions(options);
		},
		destroy() {
			myChart.destroy();
		}
	};
};
