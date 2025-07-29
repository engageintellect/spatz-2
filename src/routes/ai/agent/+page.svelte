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
		<div class="animate-fade-in space-y-1 text-sm text-muted-foreground">
			<p>You're querying an agent hosted on n8n.</p>
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
	<div class="space-y-2 py-2">
		<p class="whitespace-pre-wrap rounded-lg border bg-card p-4">
			{responseText}
		</p>
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
