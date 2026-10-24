<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ThemeSwitcher } from '$lib/components/ui/theme-switcher';
	import { ModeWatcher } from 'mode-watcher';
	import CommandPanel from '../../lib/components/CommandPanel.svelte';

	import '../../app.css';

	let { children } = $props();
</script>

<ModeWatcher />

<ThemeSwitcher class="fixed bottom-4 right-4" />

<CommandPanel />

<Toaster position="top-center" />

<div class="flex h-screen w-screen flex-col">
	<AppHeader />
	<div class="h-full w-full flex-1">
		{@render children?.()}
	</div>
</div>
