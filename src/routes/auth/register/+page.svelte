<script lang="ts">
	// import { PageData } from './$types.js';
	import * as Form from '$lib/components/ui/form';
	import { fade } from 'svelte/transition';
	export let data;
	import { Input } from '$lib/components/ui/input';
	import { registerUserSchema, type RegisterUserSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Icon from '@iconify/svelte';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { onDestroy, onMount, tick } from 'svelte';
	import { companyInfo } from '$lib/data.js';

	let isSubmitting = false;

	const form = superForm(data.form, {
		validators: zodClient(registerUserSchema)
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

<svelte:head>
	<title>Contact : {companyInfo.name}</title>
	<meta
		name="description"
		content={`Contact us for more information about our services. We are dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>
<div
	class="flex h-full w-full flex-col justify-center gap-5 rounded-lg p-5 sm:min-h-full md:flex-col md:justify-center md:border-none md:shadow-none"
>
	<div class="flex w-full items-center justify-center">
		<div class="w-full max-w-xs">
			<div class="contact-header flex flex-col items-start gap-2">
				<div class="flex w-full items-center justify-center gap-5">
					<div class="text-5xl font-bold lowercase">Register</div>
					<Icon icon="material-symbols:login" class="contact-title-icon text-5xl" />
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-xs">
		<form
			method="POST"
			action="/auth/register?"
			class="contact-form"
			use:enhance={({ cancel }) => {
				if (isSubmitting) return cancel(); // Prevent multiple submissions
				isSubmitting = true;

				return async ({ result, update }) => {
					console.log('result', result);
					if (result.type === 'redirect' && result.location === '/') {
						toast.success('Form Submitted Successfully!', {
							description: "We'll get back to you as soon as possible, typically within 24 hours."
						});
					} else {
						toast.error('Failed to Submit Form', {
							description: 'Please check your input and try again.'
						});
					}

					await update();
					isSubmitting = false;
				};
			}}
		>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="passwordConfirm">
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="mt-5">
				{#if $formData.password}
					<div
						in:fade={{ duration: 500 }}
						class="alert mb-2 flex rounded border border-primary p-2 text-sm"
					>
						<Icon icon="material-symbols:encrypted" class="h-10 w-10 text-primary" />
						<div class="text-left">
							Your password will be encrypted for your safety, it will not be readable by anyone.
						</div>
					</div>
				{/if}

				<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton w-full">
					<div class="flex items-center gap-2 text-xl">
						<div class="lowercase">register</div>
						<Icon
							icon={`${isSubmitting ? 'mingcute:loading-fill' : 'material-symbols:login'}`}
							class={`${isSubmitting ? 'animate-spin' : ''} h-7 w-7 transition-transform duration-300 lg:group-hover/sendButton:translate-x-1`}
						/>
					</div>
				</Form.Button>
			</div>

			<p class="mt-2 text-center text-sm text-muted-foreground">
				Already have an account? <a
					href="/auth/login"
					class="underline underline-offset-4 hover:text-primary">Login</a
				>
			</p>
		</form>
	</div>
</div>
