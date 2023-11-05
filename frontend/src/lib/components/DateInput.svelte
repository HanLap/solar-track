<script lang="ts">
	import * as datefns from 'date-fns';
	import { format } from 'date-fns';
	import { createEventDispatcher } from 'svelte';

	export let date: Date;
	export let name: string | undefined = undefined;
	export let arrows = false;
	export let hidden = false;

	const dispatch = createEventDispatcher();

	let value: string;

	const input = (x: Date) => (value = format(date, 'yyyy-MM-dd'));
	const output = (x: string) => (date = new Date(x));

	$: input(date);
	$: output(value);

	function dispatchChange(e: any) {
		dispatch('change', new Date(e.currentTarget.value));
	}

	function handlePrevDay() {
		date = datefns.addDays(date, -1);
		dispatch('change', date);
	}

	function handleNextDay() {
		date = datefns.addDays(date, 1);
		dispatch('change', date);
	}
</script>

<div class="input-group grid-cols-[auto_1fr_auto] max-w-fit">
	{#if arrows && !hidden}
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
	{/if}
	<input type="date" {name} bind:value class="px-3" on:change={dispatchChange} {hidden} />
	{#if arrows && !hidden}
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
	{/if}
</div>
