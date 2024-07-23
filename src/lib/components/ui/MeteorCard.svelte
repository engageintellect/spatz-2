<script>
	import Meteors from '$lib/components/magic-ui/Meteors.svelte';
</script>

<div
	class="relative flex h-full w-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl"
>
	<Meteors number={30} />
	<p
		class="z-10 whitespace-pre-wrap bg-gradient-to-br from-white to-blue-900/40 bg-clip-text text-center text-5xl font-semibold tracking-tight text-transparent"
	>
		Meteors
	</p>
</div>
