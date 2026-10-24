<script lang="ts">
	import { goto } from '$app/navigation';
	import { AdminStatus } from '$lib/admin.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Download, HousePlusIcon, Sun, ThermometerSun } from 'lucide-svelte';
	import { saveMeasurement } from '../../routes/(app)/data.remote';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

	let open = $state(false);
	const adminStatus = AdminStatus();

	$effect(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (
				(e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
				(e.key === 'p' && (e.metaKey || e.ctrlKey))
			) {
				e.preventDefault();
				open = !open;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const close = {
		onSelect: () => (open = false)
	};

	async function handleSaveMeasurement() {
		open = false;
		try {
			await saveMeasurement({ token: adminStatus.token });
			goto(resolve('/'));
		} catch (e) {
			console.error(e);
			if (e && typeof e === 'object' && 'status' in e) {
				toast.error(`Could not save measurement. Reason: ${e.status}`);
			} else {
				toast.error(`Something Unexpected happened`);
			}
		}
	}
</script>

<Command.Dialog bind:open>
	<Command.Input autofocus placeholder="Suche..." />
	<Command.List>
		<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
		<Command.Group heading="Navgiation">
			<Command.LinkItem href="/" {...close}>
				<Sun class="mr-2 h-4 w-4" />
				<span>Dashboard</span>
			</Command.LinkItem>
			<Command.LinkItem href="/export" {...close}>
				<Download class="mr-2 h-4 w-4" />
				<span>CSV exportieren</span>
			</Command.LinkItem>
		</Command.Group>
		{#if adminStatus.enabled}
			<Command.Separator />
			<Command.Group heading="Admin">
				<Command.Item onSelect={handleSaveMeasurement}>
					<ThermometerSun class="mr-2 h-4 w-4" />
					<span>Get Measurement</span>
				</Command.Item>
				<Command.LinkItem href="/new" {...close}>
					<HousePlusIcon class="mr-2 h-4 w-4" />
					<span>Create Solar Plant</span>
				</Command.LinkItem>
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
