<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { formSchema, type FormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Icon from '@iconify/svelte';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';

	export let action: string = '';

	export let data: SuperValidated<Infer<FormSchema>>;
	let isSubmitting = false;

	$: selectedType = $formData.type
		? {
				label: $formData.type,
				value: $formData.type
			}
		: undefined;

	$: selectedPriority = $formData.priority
		? {
				label: $formData.priority,
				value: $formData.priority
			}
		: undefined;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData } = form;

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = async () => {
		await tick(); // Wait for the DOM to update

		gsapInstance.from('.contact-header', {
			duration: 1,
			opacity: 0,
			y: -10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.contact-header',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.contact-form', {
			duration: 1,
			opacity: 0,
			y: 10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.contact-form',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.contact-title-icon', {
			duration: 1,
			opacity: 0,
			y: -10,
			scale: 0.8,
			ease: 'power2.out'
		});
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			import('gsap').then(({ gsap }) => {
				import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
					gsap.registerPlugin(ScrollTrigger);
					gsapInstance = gsap;
					ScrollTriggerInstance = ScrollTrigger;
					initializeAnimations();
					ScrollTriggerInstance.refresh();
				});
			});
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<div class="flex w-full items-center justify-center">
	<div class="w-full max-w-md">
		<div class="contact-header flex flex-col items-start gap-2">
			<!-- <img
				src={Logo}
				alt="Jitka"
				class="mb-5 hidden h-16 w-16 rounded-full border shadow-lg md:mx-auto md:flex"
			/> -->
			<div class="flex items-center gap-5">
				<div class="text-5xl font-bold lowercase md:text-7xl">Contact</div>
				<Icon
					icon="material-symbols:android-chat"
					class="contact-title-icon text-5xl md:text-7xl"
				/>
			</div>
			<!-- <div class="text-2xl font-thin">
				Have a question, or would like to schedule a consultation or appointment? Fill out the form,
				we'll get back to you shortly.
			</div> -->
			<!-- 
			<div class="mt-5 flex items-center text-xl">
				<div>Or, send us a</div>
				<a href="sms:9499935222" class="ml-2">
					<Button variant="outline" class="flex items-center gap-2 uppercase">
						<div>text message</div>
					</Button>
				</a>
			</div> -->
		</div>
	</div>
</div>

<div class="mx-auto w-full max-w-md">
	<form
		method="POST"
		{action}
		class="contact-form"
		use:enhance={({ cancel }) => {
			if (isSubmitting) return cancel(); // Prevent multiple submissions
			isSubmitting = true;

			return async ({ result, update }) => {
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

		<!-- <Form.Field {form} name="phone">
			<Form.Control let:attrs>
				<Form.Label>Phone</Form.Label>
				<Input {...attrs} bind:value={$formData.phone} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field> -->

		<div class="mb-2 flex items-center gap-2 md:gap-5">
			<Form.Field {form} name="type" class="w-full">
				<Form.Control let:attrs>
					<Form.Label>Message Type</Form.Label>
					<Select.Root
						name="messageType"
						selected={selectedType}
						onSelectedChange={(v) => {
							v && ($formData.type = v.value);
						}}
					>
						<Select.Trigger {...attrs} class="w-full">
							<Select.Value class="" placeholder="Select Type" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item class="" label="Issue" value="Issue">Issue</Select.Item>
							<Select.Item class="" label="Feedback" value="Feedback">Feedback</Select.Item>
							<Select.Item class="" label="General Question" value="General Question"
								>General Question</Select.Item
							>
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.type} name={attrs.name} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="priority" class="w-full">
				<Form.Control let:attrs>
					<Form.Label>Priority</Form.Label>
					<Select.Root
						name="priority"
						selected={selectedPriority}
						onSelectedChange={(v) => {
							v && ($formData.priority = v.value);
						}}
					>
						<Select.Trigger {...attrs} class="w-full">
							<Select.Value class="" placeholder="Priority" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item class="" label={'0'} value={'0'}>0 - critical</Select.Item>
							<Select.Item class="" label={'1'} value={'1'}>1 - high</Select.Item>
							<Select.Item class="" label={'2'} value={'2'}>2 - med</Select.Item>
							<Select.Item class="" label={'3'} value={'3'}>3 - low</Select.Item>
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.priority} name={attrs.name} />
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
			<div class="flex items-center gap-2 text-xl">
				<div class="lowercase">Send</div>
				<Icon
					icon={`${isSubmitting ? 'mingcute:loading-fill' : 'mdi:arrow-right'}`}
					class={`${isSubmitting ? 'animate-spin' : ''} h-5 w-5 transition-transform duration-300 lg:group-hover/sendButton:translate-x-1`}
				/>
			</div>
		</Form.Button>

		<p class="mt-2 text-center text-sm text-muted-foreground">
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
