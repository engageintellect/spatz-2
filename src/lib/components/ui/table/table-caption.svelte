<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLAttributes<HTMLTableCaptionElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<caption class={cn('mt-5 text-sm text-muted-foreground', className)} {...$$restProps}>
	<slot />
</caption>
