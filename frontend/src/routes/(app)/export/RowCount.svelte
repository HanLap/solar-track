<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';

	interface Props {
		fetching: boolean;
		count: number | undefined;
	}

	let { fetching, count }: Props = $props();
</script>

<div class="text-muted-foreground flex h-4 items-center text-sm">
	{#if fetching}
		<LoaderCircle class="w-4 animate-spin" />
	{/if}
	{#if count !== undefined}
		{count?.toLocaleString('de-DE', { useGrouping: true })} Datenpunkte
	{/if}
</div>
