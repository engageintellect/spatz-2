<script lang="ts">
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils';

	export let icon: string;
	export let title: string;
	export let body: string;
	export let url: string;
</script>

<a
	href={url}
	class={cn(
		'relative w-64 cursor-pointer overflow-hidden rounded-2xl border p-4',
		// light styles
		'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
		// dark styles
		'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
	)}
>
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Icon class="h-6 w-6 text-gray-500" {icon} />
			<!-- svelte-ignore a11y-structure -->
			<figcaption class="text-sm font-medium dark:text-white">
				{title}
			</figcaption>
		</div>
	</div>
	<blockquote class="mt-2 text-sm">{body}</blockquote>
</a>
