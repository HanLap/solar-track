<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Token from './Token.svelte';

	const flipDurationMs = 200;

	export let items: { id: string; desc: string }[];
	export let highlight: boolean = false;

	const dispatch = createEventDispatcher();

	function handleSort(e: CustomEvent<DndEvent<{ id: string; desc: string }>>) {
		items = e.detail.items;
		dispatch('change', { items });
	}
</script>

<div
	use:dndzone={{
		items,
		flipDurationMs,
		centreDraggedOnCursor: true,
		dropTargetClasses: ['!border-primary'],
		dropTargetStyle: {},
	}}
	on:consider={handleSort}
	on:finalize={handleSort}
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
