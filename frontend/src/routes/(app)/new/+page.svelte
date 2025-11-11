<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { form } = $props();
</script>

<div class="mx-0 mt-4 flex flex-col justify-center md:mx-10">
	<h3 class="h3 font-bold">Neue Solaranlage erstellen</h3>

	<form class="mx-auto mt-4 flex flex-col gap-5" method="POST" use:enhance>
		{#if form?.error}
			<div class="border-destructive bg-destructive/20 w-96 rounded-lg border p-4">
				Konnte die Solaranlage nicht erstellen: <br />{JSON.stringify(
					form.error.fieldErrors,
					null,
					2
				)}
			</div>
		{/if}

		<label class="label w-80">
			<span>Name:</span>
			<input class="input" type="text" name="name" value="" />
		</label>
		<label class="label w-80">
			<span>Beschreibung:</span>
			<textarea class="textarea" name="description" value=""></textarea>
		</label>
		<div class="flex gap-4">
			<label class="label w-32">
				<span>IP-Adresse:</span>
				<input class="input px-2" type="text" name="ip" placeholder="111.111.111.111" />
			</label>

			<label class="label w-24">
				<span>Port:</span>
				<input class="input px-2" type="number" name="port" value={12345} />
			</label>
		</div>
		<div>
			<h4 class="h4">Wechselrichter-Adressraum</h4>
			<div class="flex gap-4">
				<label class="label w-16">
					<span>Start:</span>
					<input class="input px-2" type="number" name="addrStart" value={1} />
				</label>
				<label class="label w-16">
					<span>Ende:</span>
					<input class="input px-2" type="number" name="addrEnd" value={10} />
				</label>
			</div>
		</div>

		<Button class="btn variant-filled-primary mt-10" type="submit">Erstellen</Button>
	</form>
</div>
