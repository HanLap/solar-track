<script lang="ts">
	import { type DndEvent, dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Token from './Token.svelte';
	import type { DataItem } from './Data';

	const flipDurationMs = 200;

	interface Props {
		items: DataItem[];
		highlight?: boolean;
		onChange?: (items: DataItem[]) => void;
	}

	let { items = $bindable(), highlight = false, onChange }: Props = $props();

	function handleSort(e: CustomEvent<DndEvent<DataItem>>) {
		items = e.detail.items;
		onChange?.(items);
	}
</script>

<div
	use:dndzone={{
		items,
		flipDurationMs,
		centreDraggedOnCursor: true,
		dropTargetClasses: ['!border-primary'],
		dropTargetStyle: {}
	}}
	onconsider={handleSort}
	onfinalize={handleSort}
	class="flex h-full items-center gap-1 rounded border-2 border-transparent p-1 transition"
>
	{#each items as item (item.id)}
		<div
			class="flex items-end gap-0.5 after:content-[','] last:after:content-['']"
			animate:flip={{ duration: flipDurationMs }}
		>
			<Token {item} {highlight} />
		</div>
	{/each}
</div>

<style>
	:global(#dnd-action-dragged-el::after) {
		content: '';
	}
</style>
