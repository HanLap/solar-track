<script lang="ts">
	import { format } from 'date-fns';
	import * as datefns from 'date-fns';
	import { createEventDispatcher } from 'svelte';

	export let date: Date;

	const dispatch = createEventDispatcher();

	let value: string;

	const input = (x: Date) => (value = format(date, 'yyyy-MM-dd'));
	const output = (x: string) => (date = new Date(x));

	$: input(date);
	$: output(value);

	function dispatchChange(date: Date) {
		dispatch('change', date);
	}

	function handlePrevDay() {
		date = datefns.addDays(date, -1);
		dispatchChange(date);
	}

	function handleNextDay() {
		date = datefns.addDays(date, 1);
		dispatchChange(date);
	}
</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] max-w-fit">
	<button class="input-group-shim" on:click={handlePrevDay}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</button>
	<input type="date" bind:value class="px-3" on:change={() => dispatchChange(date)} />
	<button class="input-group-shim" on:click={handleNextDay}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>
</div>
