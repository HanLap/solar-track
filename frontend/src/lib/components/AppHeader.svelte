<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/ui/button';
	import { ThemeSwitcher } from '$lib/ui/theme-switcher';
	import { parseDate, type DateValue } from '@internationalized/date';
	import DatePicker from './DatePicker.svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	$: day = $page.data?.day;

	$: date = day && parseDate(day);

	function handleDateChange(e: CustomEvent<{ value: DateValue | undefined }>) {
		if (!e.detail.value) return;

		goto(`?day=${e.detail.value.toString()}`);
	}
</script>

<header class="flex justify-between border-b px-8 py-4">
	<div class="w-40">
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

			<DatePicker {date} on:valueChange={handleDateChange} />
		</div>
	{/if}

	<div class="flex w-40 justify-end">
		<Button href="/export" variant="outline">Daten Exportieren</Button>
	</div>
</header>
<ThemeSwitcher class="fixed bottom-4 right-4" />
