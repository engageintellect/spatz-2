<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		id: any;
		type?: string;
		disabled?: boolean;
		required?: boolean;
		errors: any;
		autoFocus?: boolean;
	}

	let {
		value = '',
		placeholder = '',
		id,
		type = 'text',
		disabled = false,
		required = false,
		errors,
		autoFocus = false
	}: Props = $props();
</script>

<div class="mb-2 w-full">
	<input
		class={type === 'file'
			? 'file-input file-input-bordered w-full'
			: 'w-full rounded border bg-background px-4 py-2 text-lg'}
		{type}
		{placeholder}
		{required}
		{disabled}
		{id}
		name={id}
		{value}
		autofocus={autoFocus ? true : false}
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
