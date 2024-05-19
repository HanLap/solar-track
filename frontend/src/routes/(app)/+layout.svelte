<script>
	import { ModeWatcher } from 'mode-watcher';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import AppHeader from '$lib/components/AppHeader.svelte';
	import '../../app.css';

	export let data;

	const duration = 300;
	const delay = duration + 0;
	const x = 20;

	const transitionIn = { easing: cubicOut, x, duration, delay };
	const transitionOut = { easing: cubicIn, x: -x, duration };
</script>

<ModeWatcher />

<div class="h-screen w-screen flex flex-col">
<AppHeader />
{#key data.header.pathname}
	<div in:fly={transitionIn} out:fly={transitionOut} class="h-full w-full flex-1">
		<slot />
	</div>
{/key}
</div>
