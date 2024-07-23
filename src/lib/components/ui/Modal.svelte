<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	export let imageSrc: string;
	export let onClose: () => void;
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let modalElement: any;

	function closeModal() {
		gsap.to(modalElement, {
			opacity: 0,
			y: 0,
			duration: 0.3,
			ease: 'power2.inOut',
			onComplete: onClose
		});

		gsap.from('.backdrop-out', {
			duration: 3,
			opacity: 0,
			ease: 'power4.out',
			delay: 0
		});
	}

	onMount(() => {
		gsap.fromTo(
			modalElement,
			{ opacity: 0, y: 300 },
			{ opacity: 1, y: 0, duration: 0.3, ease: 'power2.inOut' }
		);
	});
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-5 outline-none"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
>
	<div
		class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-5"
		on:click={closeModal}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && closeModal()}
	>
		<div
			bind:this={modalElement}
			class="relative z-50 max-h-full max-w-4xl overflow-auto rounded-lg"
		>
			<enhanced:img
				src={imageSrc}
				alt="Enlarged"
				class="h-auto max-h-[70vh] max-w-full rounded-lg object-cover"
			/>
			<Button class="absolute right-2 top-2" on:click={closeModal}>
				<div class="flex items-center gap-2">
					<Icon icon="mdi:close" class="h-7 w-7" />
				</div>
			</Button>
		</div>
	</div>
</div>
