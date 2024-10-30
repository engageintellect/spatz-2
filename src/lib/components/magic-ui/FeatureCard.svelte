<script lang="ts">
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils';

	interface Props {
		icon: string;
		title: string;
		body: string;
		url: string;
	}

	let {
		icon,
		title,
		body,
		url
	}: Props = $props();
</script>

<a
	href={url}
	class={cn(
		'relative w-64 cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow'
		// light styles
		// 'border-gray-950/[.1]',
		// dark styles
		// 'dark:border-gray-50/[.1]'
	)}
>
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			<Icon class="h-6 w-6 text-gray-500" {icon} />
			<!-- svelte-ignore a11y_figcaption_parent -->
			<figcaption class="text-sm font-medium dark:text-white">
				{title}
			</figcaption>
		</div>
	</div>
	<blockquote class="mt-2 text-sm text-muted-foreground">{body}</blockquote>
</a>
