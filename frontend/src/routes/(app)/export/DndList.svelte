<script lang="ts">
	import bg from 'date-fns/locale/bg';
	import { createEventDispatcher } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let items: { id: string; desc: string }[];
	export let highlight: boolean = false;

	const dispatch = createEventDispatcher();

	const flipDurationMs = 200;

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
		dropTargetClasses: ['border-primary-400-500-token'],
		dropTargetStyle: {}
	}}
	on:consider={handleSort}
	on:finalize={handleSort}
	class="flex items-center gap-1 border-2 border-transparent rounded p-1 h-12 transition"
>
	{#each items as item (item.id)}
		<div class:token={highlight} animate:flip={{ duration: flipDurationMs }}>
			<span
				class="chip cursor-grab"
				class:variant-ghost={!highlight}
				class:hover:variant-filled={!highlight}
				class:variant-ghost-primary={highlight}
				class:hover:variant-filled-primary={highlight}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" stroke="currentColor" stroke-width="1px" class="mr-2 h-4"
					class:text-surface-400-00-token={!highlight}
					class:text-primary-400-500-token={highlight}
				>
					<!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"
					/>
				</svg>
				{item.desc}
			</span>
		</div>
	{/each}
</div>

<style>
	.token:not(:last-child)::after {
		content: ',';
	}

	:global(#dnd-action-dragged-el::after) {
		content: '';
	}
</style>
