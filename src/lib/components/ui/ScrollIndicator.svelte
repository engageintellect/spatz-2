<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let scrollProgress = 0;

	const handleScroll = () => {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress = (scrollTop / docHeight) * 100;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<!-- Scroll progress bar -->
<div
	class="fixed left-0 top-0 z-50 h-[2px] rounded-full bg-foreground transition-all duration-300 ease-out"
	style="width: {scrollProgress}%"
></div>
