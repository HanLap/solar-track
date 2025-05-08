// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import ApexCharts from 'apexcharts';

declare global {
	interface Window {
		ApexCharts: typeof ApexCharts;
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
