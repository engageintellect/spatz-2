<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade, slide } from 'svelte/transition';
	export let message = 'New message arrived.';
	export let type = 'success';
	export let x = 'center';
	export let y = 'top';
	export let show = false;
	export let icon = 'carbon:notification';
</script>

{#if show}
	<div
		in:slide={{ duration: 300 }}
		out:fade={{ duration: 100, delay: 500 }}
		class={`fixed right-0 top-0 z-50 mt-16 flex w-full justify-center `}
	>
		<div class={`rounded-lg border ${type} p-5 shadow-lg`}>
			<div class={`flex items-center gap-2 text-${type}-content`}>
				<div>
					<Icon {icon} class="h-5 w-5" />
				</div>
				<div>{message}</div>
			</div>
		</div>
	</div>
{/if}
