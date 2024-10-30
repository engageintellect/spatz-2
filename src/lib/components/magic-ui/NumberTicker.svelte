<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { spring, tweened } from 'svelte/motion';
	import { cn } from '$lib/utils';
	let num = tweened(initial, {
		duration: duration,
		easing: cubicOut
	});
	interface Props { [key: string]: any }

	let {
		value = 100,
		initial = 0,
		duration = 2000,
		class: className = '',
		...rest
	}: Props = $props();
	
	onMount(() => {
		num.set(value);
	});
</script>

<div
	class={cn('inline-block  tracking-normal text-black dark:text-white', className)}
	{...rest}
>
	{$num.toFixed(0)}
</div>
