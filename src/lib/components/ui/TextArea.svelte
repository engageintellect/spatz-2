<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let id: any;
	export let disabled = false;
	export let required = false;
	export let errors: any;
</script>

<div class="form-control mb-2 w-full">
	<textarea
		class="w-full resize-none rounded-lg border bg-background p-2 text-lg focus-within:outline-none focus:shadow-inner"
		{placeholder}
		{required}
		{disabled}
		{id}
		name={id}
		{value}
	/>
	{#if errors}
		{#each errors as error}
			<label for={id} class="label py-0 pt-1">
				<span class="label-text-alt text-error">
					{error}
				</span>
			</label>
		{/each}
	{/if}
</div>
