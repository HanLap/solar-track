<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';

	let enabled = $state(false);

	$effect(() => {
		if (window) {
			enabled = localStorage.getItem('admin') === 'true';
		}
	});
</script>

{#if enabled}
	<form method="POST" class="contents" use:enhance>
		<Card class="flex gap-0 p-4">
			<Button variant="link" type="submit" formaction="/?/saveMeasurement">Get Measurement</Button>

			<a href="/new" class={buttonVariants({ variant: 'link' })}>New</a>
		</Card>
	</form>
{/if}
