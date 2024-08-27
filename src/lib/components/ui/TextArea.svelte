<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let id: any;
	export let disabled = false;
	export let required = false;
	export let errors: any;
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	onMount(() => {
		gsap.fromTo(
			`#${id}`,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 1
			}
		);
	});
</script>

<div class="form-control mb-2 w-full">
	{#if errors}
		<div class="mb-2">
			<label in:fade for={id} class="label py-0">
				{#each errors as error}
					<span class="label-text-alt mb-2 text-destructive">
						{error}
					</span>
				{/each}
			</label>
		</div>
	{/if}

	<textarea
		class="w-full resize-none rounded-lg border bg-background p-2 text-lg focus-within:outline-none focus:shadow-inner"
		{placeholder}
		{required}
		{disabled}
		{id}
		name={id}
		bind:value
	></textarea>

	<div class="flex justify-end text-sm">
		<div class={`${value.length > 250 ? 'text-destructive' : ''} flex justify-end`}>
			{value.length}/250
		</div>
	</div>
</div>
