<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { type DateValue, parseDate } from '@internationalized/date';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import DatePicker from './DatePicker.svelte';

	let day = $derived(page.data?.day);

	let date = $derived(day && parseDate(day));

	function handleDateChange(value: DateValue | undefined) {
		if (!value) return;

		goto(`?day=${value.toString()}`);
	}
</script>

<header class="flex items-stretch justify-between border-b px-8 py-4">
	<div class="content-center">
		<a href="/">
			<h1 class="text-2xl">Solaranlage</h1>
		</a>
	</div>
	{#if date}
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
