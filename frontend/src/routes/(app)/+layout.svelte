<script>
	import { page } from '$app/stores';
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import '../../app.css';

	export let data;

	const duration = 300;
	const delay = duration + 0;
	const x = 20;

	const transitionIn = { easing: cubicOut, x, duration, delay };
	const transitionOut = { easing: cubicIn, x: -x, duration };
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-100-800-token" shadow="shadow-lg">
			<div slot="lead" class="w-fit">
				<a
					href={$page.data?.header?.navigateBack}
					class=""
					class:invisible={!$page.data?.header?.navigateBack}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</a>
			</div>
			<a href="/">
				<h3 class="h3 font-semibold">{$page.data?.header?.title ?? 'Solaranlage'}</h3>
			</a>

			<div slot="trail" class="w-fit">
				<LightSwitch />
			</div>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment>
		{#key data.header.pathname}
			<div in:fly={transitionIn} out:fly={transitionOut} class="h-full">
				<slot />
			</div>
		{/key}
	</svelte:fragment>
</AppShell>
