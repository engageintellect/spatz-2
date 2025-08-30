<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cn } from '$lib/utils';

	let {
		value = 100,
		initial = 0,
		duration = 2000,
		class: className = '',
		...rest
	}: Props = $props();

	let num = tweened(initial, {
		duration: duration,
		easing: cubicOut
	});

	interface Props {
		[key: string]: any;
	}

	onMount(() => {
		num.set(value);
	});
</script>

<div class={cn('inline-block tracking-normal', className)} {...rest}>
	{$num.toFixed(0)}
</div>
