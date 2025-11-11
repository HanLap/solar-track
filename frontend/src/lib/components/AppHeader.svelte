<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { appState } from '$lib/appState.svelte';
	import { Button } from '$lib/components/ui/button';
	import { type DateValue } from '@internationalized/date';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import DatePicker from './DatePicker.svelte';

	let date = $derived(appState().date);

	function handleDateChange(value: DateValue | undefined) {
		if (!value) return;

		goto(`?day=${value.toString()}`);
	}
</script>

<header class="flex items-stretch justify-between border-b px-8 py-4">
	<div class="content-center">
		<a href="/" data-sveltekit-preload-data="false">
			<h1 class="text-2xl">Solaranlage</h1>
		</a>
	</div>
	{#if page.url.pathname === resolve('/')}
		<div
			class="flex flex-1 justify-center gap-4"
			transition:fade={{ duration: 300, easing: cubicInOut }}
		>
			<Button href=".">Heute</Button>

			<DatePicker value={date} onValueChange={handleDateChange} />
		</div>
	{/if}

	<div class="flex w-40 justify-end">
		<Button href="/export" variant="outline">Daten Exportieren</Button>
	</div>
</header>
