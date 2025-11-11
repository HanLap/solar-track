<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import type { CalendarDate } from '@internationalized/date';
	import { getMeasurementCount } from '$lib/features/export/endpoints/getMeasurementCount.remote';

	interface Props {
		start: CalendarDate;
		end: CalendarDate;
	}

	let { start, end }: Props = $props();

	const rowCount = $derived(
		getMeasurementCount({
			id: 1,
			start: start.toString(),
			end: end.toString()
		})
	);
</script>

<div class="text-muted-foreground flex h-4 items-center text-sm">
	{#if rowCount.loading}
		<LoaderCircle class="w-4 animate-spin" />
	{:else}
		{rowCount.current?.toLocaleString('de-DE', { useGrouping: true }) ?? 0} Datenpunkte
	{/if}
</div>
