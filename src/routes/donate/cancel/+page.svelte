<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<main
	class="mx-auto max-w-lg rounded-lg p-2 transition-all duration-300 md:border md:p-5 md:shadow"
>
	<h1 class="text-3xl font-bold">payment canceled</h1>
	<p class="mt-4 text-lg">
		It looks like your payment was cancelled. If this was a mistake, you can <a
			href="/donate"
			class="text-info hover:underline">try again</a
		>.
	</p>
	<Button href="/" class="mt-5">return to home</Button>
</main>
