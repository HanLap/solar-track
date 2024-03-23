<script lang="ts">
	import { Button } from '$lib/ui/button';
	import { Calendar } from '$lib/ui/calendar';
	import * as Popover from '$lib/ui/popover';
	import { cn } from '$lib/utils';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const df = new DateFormatter('de-DE', {
		dateStyle: 'long',
	});

	export let date: DateValue | undefined;
	let className: string | undefined = undefined;
	export { className as class };

	const dispatchEvent = createEventDispatcher();

	function onValueChange(value: DateValue | undefined) {
		dispatchEvent('valueChange', { value });
	}
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'w-52 min-w-fit justify-start text-left font-normal',
				!date && 'text-muted-foreground',
				className,
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{date ? df.format(date.toDate(getLocalTimeZone())) : 'Datum auswählen'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" aria-modal>
		<Calendar bind:value={date} initialFocus locale="de-DE" {onValueChange} />
	</Popover.Content>
</Popover.Root>
