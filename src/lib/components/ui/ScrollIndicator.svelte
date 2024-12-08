<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { fade } from 'svelte/transition';

	let scrollProgress = $state(0);
	let layoutOffset = $state(0);
	let layoutWidth = $state(0);
	let loading = $state(false);

	// Access the sidebar state
	const sidebar = useSidebar();

	const handleScroll = () => {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress = (scrollTop / docHeight) * 100;
	};

	const updateLayoutDimensions = async () => {
		await tick(); // Wait for DOM updates
		const layout = document.querySelector('.layout-container');
		if (layout) {
			layoutOffset = layout.getBoundingClientRect().left;
			layoutWidth = layout.clientWidth;
		}
	};

	const handleSidebarChange = async () => {
		await tick(); // Wait for DOM changes after the state update
		updateLayoutDimensions(); // Recalculate dimensions after DOM settles
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', updateLayoutDimensions);

		// Initial calculation
		updateLayoutDimensions();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateLayoutDimensions);
		};
	});

	// Reactively update layout dimensions when sidebar state changes
	$effect(() => {
		if (sidebar.state === 'expanded' || sidebar.state === 'collapsed') {
			setTimeout(() => {
				loading = true;
				tick();
				handleSidebarChange(); // Handle changes immediately after state update
			}, 300);
			loading = false;
		}
	});
</script>

<!-- Scroll progress bar -->

{#if loading}
	<div
		in:fade={{ duration: 500 }}
		class={` fixed top-[55px] z-10 h-[1px] bg-foreground`}
		style="left: {layoutOffset}px; width: calc({layoutWidth}px * {scrollProgress / 100})"
	></div>

	<div class="layout-container mx-auto max-w-5xl">
		<!-- Your layout content goes here -->
	</div>
{/if}
