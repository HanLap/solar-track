<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import AppHeader from '$lib/components/AppHeader.svelte';
	import '../../app.css';

	let { data, children } = $props();

	const duration = 300;
	const delay = duration + 0;
	const x = 20;

	const transitionIn = { easing: cubicOut, x, duration, delay };
	const transitionOut = { easing: cubicIn, x: -x, duration };
</script>

<ModeWatcher />

<div class="flex h-screen w-screen flex-col">
	<AppHeader />
	{#key data.header.pathname}
		<div in:fly={transitionIn} out:fly={transitionOut} class="h-full w-full flex-1">
			{@render children?.()}
		</div>
	{/key}
</div>
