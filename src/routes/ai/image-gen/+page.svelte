<script lang="ts">
	import { onMount } from 'svelte';
	import { generatedImage } from '$lib/stores/generatedImage';
	import { toast } from '$lib/stores/toast';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';

	let prompt = '';
	let imageUrl = '';
	let isLoading = false;

	const examplePrompts = [
		'A futuristic city at sunset',
		'A cat wearing sunglasses on the beach',
		'An astronaut relaxing in a field of flowers',
		'A dragon made of clouds',
		'A cyberpunk robot bartender'
	];

	onMount(async () => {
		const { prompt: savedPrompt, imageUrl: savedImageUrl } = get(generatedImage);
		prompt = savedPrompt;

		if (savedImageUrl) {
			try {
				const res = await fetch(savedImageUrl, { method: 'HEAD' });
				if (res.ok) {
					imageUrl = savedImageUrl;
				} else {
					// URL is stale/broken
					generatedImage.set({ prompt: '', imageUrl: '' });
				}
			} catch (err) {
				// Network issue or invalid URL
				generatedImage.set({ prompt: '', imageUrl: '' });
			}
		}
	});

	async function generateImage() {
		if (!prompt.trim()) return;

		isLoading = true;
		imageUrl = '';

		try {
			const res = await fetch('/api/image-gen', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt })
			});

			const data = await res.json();
			if (data.data) {
				imageUrl = data.data;
				generatedImage.set({ prompt, imageUrl: data.data });
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

	function copyImageUrl() {
		navigator.clipboard.writeText(imageUrl).then(() => {
			toast.set({
				show: true,
				message: 'Image URL copied to clipboard',
				type: 'bg-background',
				icon: 'material-symbols:content-copy-outline'
			});
			setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
		});
	}

	function clearImage() {
		generatedImage.reset();
		prompt = '';
		imageUrl = '';
	}
</script>

<section class="sticky top-[57px] z-10 mx-auto w-full max-w-2xl border-b backdrop-blur-sm">
	<div class="flex w-full flex-col">
		<div in:fade={{ delay: 0, duration: 300 }} class="my-2 flex items-center gap-2 md:mt-0">
			<Icon icon="simple-icons:openai" class="h-7 w-7" />
			<h1 class="text-2xl font-thin">dall-e-3</h1>
		</div>
	</div>

	<form on:submit|preventDefault={generateImage} class="my-2 flex gap-2">
		<input
			bind:value={prompt}
			placeholder="Describe an image..."
			class="w-full rounded-lg border bg-card p-2"
		/>
		<Button type="submit" variant="default" class="shrink-0">
			{#if isLoading}
				<Icon icon="eos-icons:bubble-loading" class="h-5 w-5" />
			{:else}
				<Icon icon="mdi:magic" class="h-5 w-5" />
			{/if}
		</Button>

		{#if imageUrl}
			<Button variant="destructive" onclick={clearImage}>
				<Icon icon="mdi:delete" class="h-4 w-4" />
			</Button>
		{/if}
	</form>
</section>
<div class="-z-10 w-full py-5 md:p-5">
	{#if isLoading}
		<p class="animate-pulse text-sm text-muted-foreground">Generating image...</p>
	{:else if !imageUrl}
		<div class="animate-fade-in flex flex-col gap-5 text-sm text-sm text-muted-foreground">
			<p>
				You're using the <code class="text-foreground">dall-e-3</code> image-generation model.
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

{#if imageUrl}
	<div class="py-2">
		<img src={imageUrl} alt="AI Generated Image" class="max-w-full rounded-lg border" />
		<Button class="" variant="secondary" on:click={copyImageUrl}>
			<Icon icon="mdi-content-copy" class="mr-2 h-4 w-4" />
			Copy Image URL
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
