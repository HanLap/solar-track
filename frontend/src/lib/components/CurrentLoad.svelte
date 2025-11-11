<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import { cn } from '$lib/utils';

	interface Props {
		ivmax: number;
		currentLoad: number;
	}

	let { currentLoad, ivmax }: Props = $props();

	let roundedLoad = $derived((Math.round(currentLoad * 10) / 10).toFixed(1));
</script>

<div class="flex w-full flex-col items-center justify-center gap-2">
	<div class="w-[40rem] max-w-full">
		<div class="flex justify-between px-4 py-1">
			<span>Momentane Auslastung:</span>

			<div class={cn('flex gap-2')}>
				<span class="border-r-2 pr-2">{roundedLoad} W</span>
				<span>{Math.round((currentLoad / ivmax) * 100)}%</span>
			</div>
		</div>
		<Progress value={currentLoad} max={ivmax} />
	</div>
</div>
