<script lang="ts">
	import { Button } from '$lib/ui/button';
	import * as Popover from '$lib/ui/popover';
	import RangeCalendar from '$lib/ui/range-calendar/range-calendar.svelte';
	import { cn } from '$lib/utils';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { ArrowBigRight, CalendarIcon, MoveRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const df = new DateFormatter('de-DE', {
		dateStyle: 'long',
	});

	export let value: DateRange = {
		start: today(getLocalTimeZone()),
		end: today(getLocalTimeZone()),
	};
	let className: string | undefined = undefined;
	export { className as class };

	const dispatchEvent = createEventDispatcher();

	function onValueChange(value: DateRange | undefined) {
		dispatchEvent('valueChange', { value });
	}
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'w-96 min-w-fit justify-start text-left font-normal',
				!(value.start && value.end) && 'text-muted-foreground',
				className,
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			<span class="grid w-full grid-cols-[1fr,min-content,1fr] items-center justify-between gap-2">
				{value.start ? df.format(value.start.toDate(getLocalTimeZone())) : 'Startdatum'}
				<MoveRight class="w-4" />
				{value.end ? df.format(value.end.toDate(getLocalTimeZone())) : 'Endatum'}
			</span>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<RangeCalendar bind:value initialFocus locale="de-DE" {onValueChange} />
	</Popover.Content>
</Popover.Root>
