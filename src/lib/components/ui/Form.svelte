<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { formSchema } from '$lib/schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';

	let { action, data }: any = $props();

	let isSubmitting: boolean = $state(false);

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	let { form: formData } = form;

	$effect(() => {
		animateMainStagger();
	});
</script>

<div class="animate-item flex w-full items-center justify-center">
	<div class="w-full max-w-md">
		<div class="contact-header flex flex-col items-start gap-2">
			<div class="flex items-center gap-5">
				<div class="text-5xl font-bold lowercase md:text-7xl">Contact</div>
				<Icon
					icon="material-symbols:android-chat"
					class="contact-title-icon text-5xl md:text-7xl"
				/>
			</div>
		</div>
	</div>
</div>

<div class="animate-item mx-auto w-full max-w-md">
	<form
		method="POST"
		{action}
		class="contact-form"
		use:enhance={({ cancel }) => {
			if (isSubmitting) return cancel(); // Prevent multiple submissions
			isSubmitting = true;

			return async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Form Submitted Successfully!', {
						description: "We'll get back to you as soon as possible, typically within 24 hours."
					});
				} else {
					toast.error('Failed to Submit Form', {
						description: 'Please check your input and try again.'
					});
				}

				// await update();
				applyAction(result);
				isSubmitting = false;
			};
		}}
	>
		<div class="mb-2 flex items-center gap-2 md:gap-5">
			<Form.Field {form} name="firstName" class="w-full">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input {...attrs} bind:value={$formData.firstName} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="lastName" class="w-full">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input {...attrs} bind:value={$formData.lastName} />
				</Form.Control>
			</Form.Field>
		</div>

		<div class="flex items-center gap-2 md:gap-5">
			<Form.Field {form} name="firstName" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="lastName" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="mb-2 flex items-center gap-2 md:gap-5">
			<Form.Field {form} name={'type'} class="w-full">
				<Form.Control let:attrs>
					<Form.Label>Type</Form.Label>
					<Select.Root name="type" type="single" bind:value={$formData.type}>
						<Select.Trigger {...attrs}>
							{$formData.type}
						</Select.Trigger>
						<Select.Content>
							{#each ['Issue', 'Feedback', 'General Question'] as item}
								<Select.Item label={item} value={item}>{item}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name={'priority'} class="w-full">
				<Form.Control let:attrs>
					<Form.Label>Priority</Form.Label>
					<Select.Root name="priority" type="single" bind:value={$formData.priority}>
						<Select.Trigger {...attrs}>
							{$formData.priority}
						</Select.Trigger>

						<Select.Content>
							{#each ['0', '1', '2', '3'] as item}
								<Select.Item label={item} value={item}>{item}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
			</Form.Field>
		</div>

		<div class="flex items-start gap-2 md:gap-5">
			<Form.Field {form} name="type" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="priority" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="message">
			<Form.Control let:attrs>
				<Form.Label>Message</Form.Label>
				<Textarea {...attrs} bind:value={$formData.message} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton mt-5 w-full">
			<div class="flex items-center gap-2">
				<div class="lowercase">Send</div>
				<Icon
					icon={`${isSubmitting ? 'mingcute:loading-fill' : 'mdi:arrow-right'}`}
					class={`${isSubmitting ? 'animate-spin' : ''} h-5 w-5 transition-transform duration-300 lg:group-hover/sendButton:translate-x-1`}
				/>
			</div>
		</Form.Button>

		<p class="mt-5 text-center text-xs text-muted-foreground">
			By clicking continue, you agree to our
			<a href="/terms" class="underline underline-offset-4 hover:text-primary">
				Terms of Service
			</a>
			and
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
				Privacy Policy
			</a>
			.
		</p>
	</form>
</div>
