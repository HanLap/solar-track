export async function setupApex() {
	if (globalThis.window) {
		globalThis.window.ApexCharts = (await import('apexcharts')).default;
	}
}
