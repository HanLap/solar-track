<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';

	interface Props {
		load: number;
		ivmax: number;
	}

	let { load, ivmax }: Props = $props();

	let roundedLoad = $derived((Math.round(load * 10) / 10).toFixed(1));
</script>

<div class="flex w-full flex-col items-center justify-center gap-2">
	<div class="w-[40rem] max-w-full">
		<div class="flex justify-between px-4 py-1">
			<span>Momentane Auslastung:</span>

			<div class="flex gap-2">
				<span class="border-r-2 pr-2">{roundedLoad} W</span>
				<span>{Math.round((load / ivmax) * 100)}%</span>
			</div>
		</div>
		<Progress value={load} max={ivmax} />
	</div>
</div>
