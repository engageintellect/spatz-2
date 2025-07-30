<script lang="ts">
	import { onMount } from 'svelte';
	import { agentResponse } from '$lib/stores/agentResponse';
	import { toast } from '$lib/stores/toast';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';

	let prompt = '';
	let responseText = '';
	let isLoading = false;

	// Thumbnail generation
	let imageUrl = '';
	let isImageLoading = false;

	const examplePrompts = [
		'A futuristic city at sunset',
		'A cat wearing sunglasses on the beach',
		'An astronaut relaxing in a field of flowers',
		'A dragon made of clouds',
		'A cyberpunk robot bartender'
	];

	onMount(async () => {
		const { prompt: savedPrompt, response: savedResponse } = get(agentResponse);
		prompt = savedPrompt;

		if (savedResponse) {
			try {
				responseText = savedResponse;
			} catch (err) {
				responseText = '';
			}
		}
	});

	async function askAgent() {
		if (!prompt.trim()) return;

		isLoading = true;
		responseText = '';

		try {
			const res = await fetch('/api/agent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt })
			});

			const data = await res.json();
			if (data.data) {
				responseText = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
				agentResponse.set({ prompt, response: responseText });
				generateThumbnail();
			} else {
				toast.set({
					show: true,
					message: data.error || 'Image generation failed',
					type: 'bg-destructive',
					icon: 'mdi:alert-circle'
				});
			}
		} catch (err) {
			toast.set({
				show: true,
				message: 'Network or server error',
				type: 'bg-destructive',
				icon: 'mdi:cloud-off-outline'
			});
		} finally {
			isLoading = false;
		}
	}

	async function generateThumbnail() {
		if (!responseText.trim()) return;

		isImageLoading = true;
		imageUrl = '';

		try {
			const res = await fetch('/api/image-gen', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: responseText })
			});

			const data = await res.json();
			if (data.data) {
				imageUrl = data.data;
			} else {
				toast.set({
					show: true,
					message: data.error || 'Image generation failed',
					type: 'bg-destructive',
					icon: 'mdi:alert-circle'
				});
			}
		} catch (err) {
			toast.set({
				show: true,
				message: 'Network or server error',
				type: 'bg-destructive',
				icon: 'mdi:cloud-off-outline'
			});
		} finally {
			isImageLoading = false;
		}
	}

	function copyResponse() {
		navigator.clipboard.writeText(responseText).then(() => {
			toast.set({
				show: true,
				message: 'Response copied to clipboard',
				type: 'bg-background',
				icon: 'material-symbols:content-copy-outline'
			});
			setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
		});
	}

	function clearResponse() {
		agentResponse.reset();
		prompt = '';
		responseText = '';
	}
</script>

<section class="sticky top-[57px] z-10 mx-auto w-full max-w-2xl border-b backdrop-blur-sm">
	<div class="flex w-full flex-col">
		<div in:fade={{ delay: 0, duration: 300 }} class="my-2 flex items-center gap-2 md:mt-0">
			<Icon icon="simple-icons:n8n" class="h-7 w-7" />
			<h1 class="text-2xl font-thin">n8n agent</h1>
		</div>
	</div>

	<form on:submit|preventDefault={askAgent} class="my-2 flex gap-2">
		<input
			bind:value={prompt}
			placeholder="Ask the agent..."
			class="w-full rounded-lg border bg-card p-2"
		/>
		<Button type="submit" variant="default" class="shrink-0">
			{#if isLoading}
				<Icon icon="eos-icons:bubble-loading" class="h-5 w-5" />
			{:else}
				<Icon icon="mdi:magic" class="h-5 w-5" />
			{/if}
		</Button>

		{#if responseText}
			<Button variant="destructive" onclick={clearResponse}>
				<Icon icon="mdi:delete" class="h-4 w-4" />
			</Button>
		{/if}
	</form>
</section>
<div class="p-5">
	{#if isLoading}
		<p class="animate-pulse text-sm text-muted-foreground">Asking agent...</p>
	{:else if !responseText}
		<div class="animate-fade-in flex flex-col gap-5 text-sm text-muted-foreground">
			<p>You're querying an agent hosted on <span class="text-foreground">n8n</span>.</p>
			<p>
				This agent is designed to generate <span class="text-foreground">VEO3</span> prompts for our
				<a class="text-foreground hover:underline" href="https://instagram.com/sloththeories"
					>@sloththeories</a
				>
				instagram page. After the prompt is generated it's response is sent off to
				<a href="https://openai.com" class="text-foreground">OpenAI</a> in order to generate a thumbnail
				for our video/post.
			</p>

			<p>
				This is used to show how n8n workflows can be integrated into an application, as well as
				progamatically building upon their output.
			</p>

			<p>Try a prompt like:</p>
			<ul class="list-inside list-disc pl-4">
				{#each examplePrompts as example}
					<li>{example}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

{#if responseText}
	<div class="flex flex-col gap-2">
		<div class="whitespace-pre-wrap rounded-lg border bg-card p-4">
			<div>
				{responseText}
			</div>

			<div class="">
				{#if isImageLoading}
					<p class="animate-pulse text-sm text-muted-foreground">Generating thumbnail image...</p>
				{:else if imageUrl}
					<img src={imageUrl} alt="Generated Thumbnail" class="max-w-full rounded-lg border" />
				{/if}
			</div>
		</div>
		<Button class="" variant="secondary" on:click={copyResponse}>
			<Icon icon="mdi-content-copy" class="mr-2 h-4 w-4" />
			Copy Response
		</Button>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.4s ease-out both;
	}
</style>
