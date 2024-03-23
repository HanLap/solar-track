<script lang="ts">
	import { cn } from '$lib/utils';

	let className = '';
	export { className as class };
</script>

<pre class={cn('border-primary bg-primary/20 rounded border p-2 text-sm', className)}><code
		><slot /></code
	></pre>
