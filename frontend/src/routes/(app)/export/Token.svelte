<script lang="ts">
	import { cn } from '$lib/utils';
	import { GripVertical } from 'lucide-svelte';

	interface Props {
		item: { id: string; desc: string };
		highlight?: boolean;
	}

	let { item, highlight = false }: Props = $props();
</script>

<span
	class={cn(
		'bg-background text-foreground hover:bg-foreground hover:text-background flex items-center rounded border px-1 text-sm transition-colors',
		highlight &&
			'border-primary text-foreground bg-primary/20 hover:bg-primary hover:text-background'
	)}
>
	<GripVertical class="w-4" />
	<span>
		{item.desc}
	</span>
</span>
