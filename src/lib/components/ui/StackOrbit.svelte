<script lang="ts">
	import { cn } from '$lib/utils';
	import OrbitingCircles from '$lib/components/magic-ui/OrbitingCircles.svelte';
	let className: any = '';
	export { className as class };
	import Icon from '@iconify/svelte';
</script>

<div class={cn('relative flex h-full w-full items-center justify-center', className)}>
	<span
		class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
	>
	</span>

	<!--  Inner Circles  -->
	<OrbitingCircles
		class="h-[50px] w-[50px] animate-customBounce border-none bg-none"
		duration={20}
		radius={80}
		delay={40}
	>
		<!-- Open AI -->
		<Icon icon="devicon:svelte" class="h-full w-full animate-customBounce" />
	</OrbitingCircles>

	<OrbitingCircles class="h-[50px] w-[50px] border-none bg-transparent" duration={20} radius={80}>
		<!-- Open AI -->
		<Icon icon="logos:pocket-base" class="h-full w-full animate-customBounce" />
	</OrbitingCircles>
	<OrbitingCircles
		class="h-[50px] w-[50px] border-none bg-transparent"
		duration={20}
		radius={80}
		delay={-10}
	>
		<!-- Supabase -->
		<Icon icon="devicon:tailwindcss" class="h-full w-full" />
	</OrbitingCircles>

	<!-- Outer Circles (reverse)  -->
	<OrbitingCircles
		class="h-[50px] w-[50px] border-none bg-transparent"
		radius={160}
		duration={20}
		reverse
	>
		<!-- Svelte -->
		<Icon icon="simple-icons:openai" class="h-full w-full" />
	</OrbitingCircles>
	<OrbitingCircles
		class="h-[50px] w-[50px] border-none bg-transparent"
		radius={160}
		duration={20}
		delay={-10}
		reverse
	>
		<!-- Github -->
		<Icon icon="simple-icons:zod" class="h-full w-full" />
	</OrbitingCircles>
</div>
