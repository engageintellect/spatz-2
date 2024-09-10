<script lang="ts">
	import { onMount } from 'svelte';

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
	class="fixed left-0 top-[57px] z-[999] h-[2px] rounded-r-full bg-foreground transition-all duration-300 ease-out"
	style="width: {scrollProgress}%"
></div>
