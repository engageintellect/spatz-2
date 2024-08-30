<script lang="ts">
	export let value = '';
	export let avatar;
	export let userId;
	export let toastSuccess;
	export let toastError;
	export let action;
	export let placeholder = '';
	export let id: any;
	export let disabled = false;
	export let required = false;
	export let errors: any;
	export let isSubmitting = false;
	export let recordId: string | undefined = undefined; // Type can be string or undefined
	export let postId: string | undefined = undefined; // Type can be string or undefined

	import { toast } from 'svelte-sonner';
	import { enhance, applyAction } from '$app/forms';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let loading = false;
	let formElement: HTMLFormElement;

	onMount(() => {
		gsap.fromTo(
			`.animate-textarea`,
			{ opacity: 0, scale: 0.95 },
			{
				opacity: 1,
				scale: 1,
				duration: 1
			}
		);

		gsap.fromTo(
			`.animate-avatar`,
			{ opacity: 0, scale: 0.9 },
			{
				opacity: 1,
				scale: 1,
				duration: 1
			}
		);
	});

	// Automatically resize the textarea based on content
	function autoResize(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto'; // Reset height to auto
		textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Max height corresponds to 5 rows (120px)
	}

	// Handle the Enter key press for form submission
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault(); // Prevent adding a new line
			formElement.requestSubmit(); // Trigger form submission
		}
	}
</script>

<div class="">
	<form
		bind:this={formElement}
		{action}
		method="POST"
		class="w-full"
		use:enhance={({ cancel }) => {
			if (isSubmitting) return cancel();
			isSubmitting = true;

			return async ({ result, update }) => {
				if (result.type === 'success') {
					toast(toastSuccess, {});
					await update();
					await tick();
					const newPost = document.querySelector('.post-wrapper:first-child');
					if (newPost) {
						gsap.fromTo(
							newPost,
							{ opacity: 0, y: 0, scale: 0.95 },
							{
								opacity: 1,
								y: 0,
								scale: 1,
								duration: 2,
								ease: 'power4.out'
							}
						);
					}
				} else {
					applyAction(result);
					toast.error(toastError, {});
				}

				await update(); // Ensure form state (including errors) is updated
				isSubmitting = false;
			};
		}}
	>
		<div class="px-2 md:px-0">
			<input type="hidden" name="author" value={userId} />
			<input type="hidden" name="recordId" value={recordId} />
			<input type="hidden" name="post" value={postId} />

			<div class="mt-5">
				{#if errors}
					<div in:fade class="mb-2">
						<label for={id} class="label py-0">
							{#each errors as error}
								<span class="label-text-alt mb-2 text-destructive">
									{error}
								</span>
							{/each}
						</label>
					</div>
				{/if}

				<div class="flex w-full gap-2 rounded-lg duration-300">
					<div class="animate-avatar flex flex-col">
						<div class="h-10 w-10 md:h-12 md:w-12">
							<img src={avatar} class="h-full w-full rounded-full object-cover" alt="user avatar" />
						</div>
					</div>

					<textarea
						class="animate-textarea w-full resize-none rounded-lg bg-background focus-within:outline-none"
						{placeholder}
						{required}
						{disabled}
						{id}
						name={id}
						autofocus
						bind:value
						on:input={autoResize}
						on:keydown={handleKeydown}
						style="min-height: 3rem; max-height: 120px;"
					></textarea>

					<div class="item-center flex hidden justify-between gap-5 text-sm">
						<Button
							type="submit"
							class="group/submitButton h-full w-full transition-transform duration-300 md:active:scale-[98%]"
							disabled={loading}
						>
							{#if isSubmitting}
								<Icon icon="eos-icons:loading" class="h-5 w-5" />
							{:else}
								<Icon
									icon="mdi-send"
									class="h-5 w-5 transition-all duration-300 md:group-hover/submitButton:rotate-90 md:group-hover/submitButton:scale-105"
								/>
							{/if}
						</Button>
					</div>
				</div>

				<div
					class={`${value.length > 0 ? 'visible' : 'invisible'} ${value.length > 250 ? 'text-destructive' : ''} flex w-full justify-end text-sm`}
				>
					{value.length}/250
				</div>
			</div>
		</div>
	</form>
</div>
