<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginUserSchema, type LoginUserSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Icon from '@iconify/svelte';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { onDestroy, onMount, tick } from 'svelte';

	export let data: SuperValidated<Infer<LoginUserSchema>>;
	let isSubmitting = false;

	const form = superForm(data, {
		validators: zodClient(loginUserSchema)
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
	<div class="w-full max-w-sm">
		<div class="contact-header flex flex-col items-start gap-2">
			<!-- <img
				src={Logo}
				alt="Jitka"
				class="mb-5 hidden h-16 w-16 rounded-full border shadow-lg md:mx-auto md:flex"
			/> -->
			<div class="flex items-center gap-5">
				<div class="text-5xl font-bold uppercase md:text-7xl">Login</div>
				<Icon icon="material-symbols:login" class="contact-title-icon text-5xl md:text-7xl" />
			</div>
		</div>
	</div>
</div>

<div class="mx-auto w-full max-w-sm">
	<form
		method="POST"
		action="/auth/login?"
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

		<div class="mt-5">
			<a href="/auth/reset-password">forgot password?</a>

			<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton w-full">
				<div class="flex items-center gap-2 text-xl">
					<div class="uppercase">login</div>
					<Icon
						icon={`${isSubmitting ? 'mingcute:loading-fill' : 'material-symbols:login'}`}
						class={`${isSubmitting ? 'animate-spin' : ''} h-7 w-7 transition-transform duration-300 lg:group-hover/sendButton:translate-x-1`}
					/>
				</div>
			</Form.Button>
		</div>

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
