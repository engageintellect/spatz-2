<script>
	import Marquee from '$lib/components/magic-ui/Marquee.svelte';
	import FeatureCard from '$lib/components/magic-ui/FeatureCard.svelte';
	import Animate from '$lib/components/ui/Animate.svelte';

	const reviews = [
		{
			title: 'SvelteKit',
			body: 'A modern web framework for building blazing fast web apps.',
			icon: 'logos:svelte-icon',
			url: 'https://kit.svelte.dev/'
		},
		{
			title: 'PocketBase',
			body: 'Self-contained SQLite Database and User Auth.',
			icon: 'simple-icons:pocketbase',
			url: 'https://pocketbase.io/'
		},
		{
			title: 'AI',
			body: 'Vercel AI SDK with streaming OpenAI API.',
			icon: 'simple-icons:openai',
			url: 'https://vercel.com/ai'
		},
		{
			title: 'TailwindCSS',
			body: 'Utility-first CSS, leveraging shadcn-svelte, magic-ui, and GSAP.',
			icon: 'vscode-icons:file-type-tailwind',
			url: 'https://tailwindcss.com/'
		},
		{
			title: 'Zod',
			body: 'TypeScript-first schema validation with static type inference',
			icon: 'simple-icons:zod',
			url: 'https://zod.dev/'
		}
	];

	let firstRow = reviews.slice(0, reviews.length / 2);
	let secondRow = reviews.slice(reviews.length / 2);
</script>

<Animate>
	<div>
		<h1 class="mb-2 text-4xl font-bold">tech stack</h1>
		<div
			class="relative my-2 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background"
		>
			<Marquee vertical={false} pauseOnHover class="[--duration:20s]">
				{#each firstRow as item}
					<FeatureCard {...item} />
				{/each}
			</Marquee>
			<Marquee vertical={false} reverse pauseOnHover class="[--duration:20s]">
				{#each secondRow as item}
					<FeatureCard {...item} />
				{/each}
			</Marquee>
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
			></div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
			></div>
		</div>
	</div>
</Animate>
