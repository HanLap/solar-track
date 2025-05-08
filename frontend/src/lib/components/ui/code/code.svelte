<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<pre class={cn('border-primary bg-primary/20 rounded border p-2 text-sm', className)}><code
		>{@render children?.()}</code
	></pre>
