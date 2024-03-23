<script lang="ts">
	import { Progress } from '$lib/ui/progress';

	export let load: number;
	export let ivmax: number;
</script>

<div class="flex w-full flex-col items-center justify-center gap-2">
	<div class="w-[40rem] max-w-full">
		<div class="flex justify-between px-4 py-1">
			<span>Momentane Auslastung:</span>

			<span>{Math.round((load / ivmax) * 100)}%</span>
		</div>
		<Progress value={load} max={ivmax} />
	</div>
</div>
