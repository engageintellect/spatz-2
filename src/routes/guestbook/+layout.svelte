<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let loading = false;
	function goBack() {
		window.history.back();
	}
</script>

<div>
	<div class="mx-auto max-w-2xl">
		<Button
			onclick={goBack}
			size="sm"
			variant="outline"
			type="submit"
			class="group/backButton backButton flex items-center gap-2"
			disabled={loading}
		>
			<Icon
				icon="mdi:arrow-left"
				class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
			/>
			<span class="text-sm">back</span>
		</Button>
	</div>

	{@render children?.()}
</div>
