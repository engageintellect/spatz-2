<script lang="ts">
	import { onMount } from 'svelte';
	import { agentResponse } from '$lib/stores/agentResponse';
	import { agentImage } from '$lib/stores/agentImage';
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
		'sloth climbs a tree',
		'sloth talks about UFOs',
		'sloth builds a log cabin',
		'sloth goes fishing in lake'
	];

	onMount(async () => {
		const { prompt: savedPrompt, response: savedResponse } = get(agentResponse);
		const { imageUrl: savedImageUrl } = get(agentImage);
		
		prompt = savedPrompt;
		imageUrl = savedImageUrl;

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
				body: JSON.stringify({
					// 👇 add your pre‑prompt here (or leave undefined)
					system:
						'You are a creative, ultra photorealistic thumbnail designer. Keep compositions clear and centered. CRITICAL: NEVER include any text, letters, words, numbers, or written characters of any kind in the image. The image must be purely visual with NO TEXT WHATSOEVER. Focus only on visual elements, objects, scenes, and compositions without any textual content.',

					prompt: responseText
				})
			});

			const data = await res.json();
			if (data.data) {
				imageUrl = data.data; // still a plain URL/string
				agentImage.set({ prompt: responseText, imageUrl: data.data });
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

	async function copyImage() {
		if (!imageUrl) return;
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
			toast.set({
				show: true,
				message: 'Image copied to clipboard',
				type: 'bg-background',
				icon: 'mdi:image'
			});
			setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
		} catch (err) {
			toast.set({
				show: true,
				message: 'Failed to copy image',
				type: 'bg-destructive',
				icon: 'mdi:alert-circle'
			});
			setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
		}
	}

	function downloadImage() {
		if (!imageUrl) return;
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = `veo3-thumbnail-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.set({
			show: true,
			message: 'Image downloaded',
			type: 'bg-background',
			icon: 'mdi:download'
		});
		setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
	}

	function clearResponse() {
		agentResponse.reset();
		agentImage.reset();
		prompt = '';
		responseText = '';
		imageUrl = '';
	}
</script>

<section
	class="sticky top-[57px] z-10 mx-auto w-full max-w-2xl border-b bg-background/70 backdrop-blur-sm"
>
	<div class="flex w-full flex-col">
		<div in:fade={{ delay: 0, duration: 300 }} class="my-2 flex items-center gap-2 md:mt-0">
			<Icon icon="simple-icons:n8n" class="h-7 w-7" />
			<h1 class="text-2xl font-thin">n8n agent</h1>
		</div>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			askAgent();
		}}
		class="my-2 flex gap-2"
	>
		<input
			bind:value={prompt}
			placeholder="Enter your prompt..."
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
<div class="w-full py-5 md:p-5">
	{#if isLoading}
		<div class="flex items-center gap-3">
			<p class="animate-pulse text-sm text-muted-foreground">Asking agent...</p>
			<Icon icon="eos-icons:bubble-loading" class="h-3 w-3 animate-spin" />
		</div>
	{:else if !responseText}
		<div class="animate-fade-in flex flex-col gap-5 text-sm text-muted-foreground">
			<p>
				You're querying an <a href="https://n8n.io" class="text-foreground underline">n8n</a> agent hosted
				on the same VM as our PocketBase instance.
			</p>
			<p>
				This agent is designed to generate <span class="text-foreground">VEO3</span> prompts for our
				<a class="text-foreground underline" href="https://instagram.com/sloththeories"
					>@sloththeories</a
				>
				instagram page. After the prompt is generated it's response is sent off to
				<a href="https://openai.com" class="text-foreground underline">OpenAI</a> in order to generate
				a thumbnail for our video/post.
			</p>

			<p>
				This is used to show how n8n workflows can be integrated into an application, as well as
				progamatically building upon their output.
			</p>

			<div>
				You can point this API to one of your own workflows in your personal instance of N8N by
				assigning the <code class="text-primary"> 'N8N_AGENT_API' </code>
				environment variable in your
				<code>.env</code> file.
			</div>

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
	<!-- OpenAI-style chat bubble -->
	<div class="group relative mb-6">
		<div class="flex gap-4">
			<!-- Avatar -->
			<div
				class="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground"
			>
				<Icon icon="simple-icons:n8n" class="h-4 w-4" />
			</div>

			<!-- Content -->
			<div class="flex-1 space-y-4">
				<!-- Image Section -->
				{#if isImageLoading}
					<div class="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
						<Icon
							icon="eos-icons:bubble-loading"
							class="h-4 w-4 animate-spin text-muted-foreground"
						/>
						<p class="text-sm text-muted-foreground">Generating thumbnail image...</p>
					</div>
				{:else if imageUrl}
					<div class="space-y-3">
						<div class="group/image relative">
							<img
								src={imageUrl}
								alt="Generated Thumbnail"
								class="max-w-full rounded-lg border shadow-sm transition-all hover:shadow-md"
							/>
							<!-- Image action buttons -->
							<div class="absolute right-2 top-2 flex gap-1">
								<button
									onclick={copyImage}
									class="flex h-7 w-7 items-center justify-center rounded-md bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
									title="Copy image"
								>
									<Icon icon="mdi:content-copy" class="h-4 w-4" />
								</button>
								<button
									onclick={downloadImage}
									class="flex h-7 w-7 items-center justify-center rounded-md bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
									title="Download image"
								>
									<Icon icon="mdi:download" class="h-4 w-4" />
								</button>
							</div>
						</div>
						<p class="text-sm font-medium text-muted-foreground">Generated Thumbnail</p>
					</div>
				{/if}

				<!-- Text Response -->
				<div class="space-y-2">
					<div class="flex w-full items-center justify-between">
						<div class="text-sm font-medium text-muted-foreground">VEO3 Prompt</div>
						<button
							onclick={copyResponse}
							class="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted"
							title="Copy response"
						>
							<Icon icon="mdi:content-copy" class="h-4 w-4" />
						</button>
					</div>
					<div class="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
						{responseText}
					</div>
				</div>
			</div>
		</div>
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
