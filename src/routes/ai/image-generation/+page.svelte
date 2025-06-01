<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let prompt = '';
	let imageUrl = '';
	let isLoading = false;

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
</script>

<section class="mx-auto max-w-2xl">
	<form on:submit|preventDefault={generateImage} class="mb-4 flex gap-2">
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
	</form>

	{#if imageUrl}
		<div class="space-y-2">
			<img src={imageUrl} alt="Generated Image" class="max-w-full rounded-lg border" />
			<Button variant="secondary" on:click={copyImageUrl}>
				<Icon icon="mdi-content-copy" class="mr-2 h-4 w-4" />
				Copy Image URL
			</Button>
		</div>
	{/if}
</section>
