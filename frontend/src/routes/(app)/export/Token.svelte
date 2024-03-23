<script lang="ts">
	import { cn } from '$lib/utils';
	import { GripVertical } from 'lucide-svelte';

	export let item: { id: string; desc: string };
	export let highlight: boolean = false;
</script>

<span
	class={cn(
		'bg-background text-foreground hover:bg-foreground hover:text-background flex items-center rounded border px-1 text-sm transition-colors',
		highlight &&
			'border-primary text-foreground bg-primary/20 hover:bg-primary hover:text-background',
	)}
>
	<GripVertical class="w-4" />
	<span>
		{item.desc}
	</span>
</span>
