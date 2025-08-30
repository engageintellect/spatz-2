<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	interface Props {
		imageSrc: string;
		onClose: () => void;
	}

	let { imageSrc, onClose }: Props = $props();
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-5 outline-none"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
>
	<div
		class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-5"
		onclick={onClose}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && onClose()}
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
	>
		<div
			class="relative z-50 max-h-full max-w-4xl overflow-auto rounded-lg"
			in:fly={{ y: 300, duration: 300 }}
			out:fly={{ y: 300, duration: 300 }}
		>
			<enhanced:img
				src={imageSrc}
				alt="Enlarged"
				class="h-auto max-h-[70vh] max-w-full rounded-lg object-cover"
			/>
			<Button class="absolute right-2 top-2" onclick={onClose}>
				<div class="flex items-center gap-2">
					<Icon icon="mdi:close" class="h-7 w-7" />
				</div>
			</Button>
		</div>
	</div>
</div>
