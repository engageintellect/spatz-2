<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { PUBLIC_DOCS_URL, PUBLIC_REPOSITORY_URL, PUBLIC_BASE_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import Stats from './Stats.svelte';
	import { gsap } from 'gsap';

	let stars = 0,
		issues = 0,
		forks = 0;

	const getStars = async () => {
		const res = await fetch(`${PUBLIC_BASE_URL}/api/repoData`);
		const { stars: fetchedStars, issues: fetchedIssues, forks: fetchedForks } = await res.json();
		stars = fetchedStars;
		issues = fetchedIssues;
		forks = fetchedForks;
	};

	onMount(() => {
		getStars();

		// Animate "stack" on mount
		gsap.fromTo(
			'.spatz-stack',
			{ opacity: 0, x: -50 },
			{
				opacity: 1,
				x: 0,
				duration: 1.5,
				ease: 'power4.out'
			}
		);

		gsap.fromTo(
			'.spatz-stack-2',
			{ opacity: 0, x: -75 },
			{
				opacity: 1,
				x: 0,
				duration: 2,
				ease: 'power4.out'
			}
		);
	});
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="flex flex-col gap-10">
		<div>
			<h1 class="text-7xl">
				<div class="flex items-center font-extrabold tracking-tight">
					<div>spatz</div>
					<div class="spatz-stack font-thin tracking-tighter text-foreground/[50%]">stack</div>
					<div class="spatz-stack-2 font-thin tracking-tighter">2</div>
				</div>
			</h1>
			<p class="mt-2">
				visit <a class="underline" href={PUBLIC_DOCS_URL}>docs</a> for more info
			</p>
			<div class="mt-2 flex w-full gap-2">
				<a
					href="https://github.com/new?template_name=spatz-2&template_owner=engageintellect"
					class="my-2 flex-1"
				>
					<Button variant="default" class="w-full bg-teal-500 hover:bg-teal-400">
						<div class="flex items-center gap-2">
							use template
							<Icon icon="mdi-download" class="h-7 w-7" />
						</div>
					</Button>
				</a>
				<a href={PUBLIC_REPOSITORY_URL} class="group/githubButton my-2 flex-1">
					<Button variant="outline" class="w-full">
						<div class="flex items-center gap-2">
							star on github
							<Icon
								icon="mdi-star"
								class="transition-color h-7 w-7 duration-500 md:group-hover/githubButton:text-yellow-500"
							/>
						</div>
					</Button>
				</a>
			</div>
		</div>

		<div>
			<h1 class="mb-2 text-4xl font-bold">about</h1>
			<p class="mt-2">
				<a href={PUBLIC_REPOSITORY_URL} class="underline">spatz</a>
				is ready, out of the box to help you build your next great idea. It includes all the features
				you need to get started quickly:
			</p>
			<ul class="mt-2 list-disc pl-10">
				<li>User Authentication</li>
				<li>Databases & Content Management</li>
				<li>Admin Dashboards</li>
				<li>User Settings & Profile panels</li>
				<li>Themes & Styling</li>
				<li>Forms</li>
				<li>Form Validation</li>
				<li>Toast Notifications</li>
				<li>Icons</li>
			</ul>
		</div>

		<div>
			<h1 class="mb-2 text-4xl font-bold">technologies</h1>
			<div class="card overflow-x-auto rounded-lg border p-2 shadow-xl">
				<table class="card-body table">
					<tbody>
						<tr>
							<td
								><a class="text-lg font-bold md:hover:underline" href="https://kit.svelte.dev"
									>Sveltekit</a
								></td
							>
							<td>A modern web framework for building blazing fast web apps.</td>
						</tr>
						<tr>
							<td
								><a class="text-lg font-bold md:hover:underline" href="https://pocketbase.io"
									>Pocketbase</a
								></td
							>
							<td>Self-contained SQLite Database and User Auth.</td>
						</tr>
						<tr>
							<td
								><a class="text-lg font-bold md:hover:underline" href="https://openai.com">AI</a
								></td
							>
							<td
								><a
									href="https://sdk.vercel.ai/docs/guides/frameworks/sveltekit"
									class="text-primary underline">Vercel AI SDK</a
								>
								with streaming
								<a href="https://openai.com" class="underline">OpenAI</a> API.</td
							>
						</tr>
						<tr>
							<td
								><a class="text-lg font-bold md:hover:underline" href="https://tailwindcss.com"
									>TailwindCSS</a
								></td
							>
							<td
								>Utility-first CSS styling with <a
									href="https://daisyui.com"
									class="text-primary underline">DaisyUI</a
								>.</td
							>
						</tr>
						<tr>
							<td><a class="text-lg font-bold md:hover:underline" href="https://zod.dev">Zod</a></td
							>
							<td>TypeScript-first schema validation with static type inference</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div>
			<h1 class="mb-2 text-4xl font-bold">getting started</h1>
			<p>It's quick and easy to get started. 5 minutes is all it takes.</p>
			<a href={PUBLIC_DOCS_URL} class="">
				<Button class="mt-2">
					<div class="flex items-center gap-2">
						<div>spatz docs</div>
						<Icon icon="mdi-github" class="h-7 w-7" />
					</div>
				</Button>
			</a>
			<div class="mb-10">
				<h1 class="mt-10 text-2xl font-bold">Sveltekit Config</h1>
				<p class="mt-2">Run the below commands to get started.</p>
				<div class="overflow-x-auto text-wrap rounded-lg bg-secondary p-2">
					<pre data-prefix=">" class="text-info"><code>clone repo and navigate to directory</code
						></pre>
					<pre data-prefix="$"><code>git clone https://github.com/engageintellect/spatz</code></pre>
					<pre data-prefix=">" class="text-info"><code
							>copy .env.example and replace values with your own</code
						></pre>
					<pre data-prefix="$"><code>cp .env.example .env.local</code></pre>
					<pre data-prefix=">" class="text-info"><code>install dependencies and run dev server</code
						></pre>
					<pre data-prefix="$"><code>pnpm i && pnpm run dev --host</code></pre>
					<pre data-prefix=">" class="text-warning"><code>installing...</code></pre>
					<pre data-prefix="" class="text-success"><code
							>server running on: http://localhost:5173</code
						></pre>
				</div>
			</div>

			<div>
				<h1 class="text-xl font-bold">Pocketbase Config</h1>
				<p class="mt-2">1. Run the below commands to get started.</p>
				<div class="my-2 overflow-x-auto text-wrap rounded-lg bg-secondary p-2">
					<pre data-prefix="$"><code
							>wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_linux_amd64.zip</code
						></pre>
					<pre data-prefix="$"><code>unzip pocketbase_0.22.9_linux_amd64.zip</code></pre>
				</div>
			</div>

			<div>
				<p class="mt-2">2. Run the below commands to get started.</p>
				<div class="my-2 overflow-x-auto text-wrap rounded-lg bg-secondary p-2">
					<pre data-prefix="$"><code>./pocketbase serve --http="0.0.0.0:8090"</code></pre>
				</div>
			</div>

			<p class="mt-2">
				3. Log into the Pocketbase Admin UI <a
					class="text-primary underline"
					href="http://localhost:8090/_/">http://localhost:8090/_/</a
				>.
			</p>
			<p class="mt-2">
				4. Go to settings > Import collections, then paste in the contents of
				./pocketbase/pb_schema.json
			</p>
			<p class="mt-2">
				5. Visit app in browser <a class="text-primary underline" href="http://localhost:5173"
					>http://localhost:5173</a
				>
			</p>
			<div class="mt-5">
				For more information, check out the <a class="text-primary underline" href={PUBLIC_DOCS_URL}
					>docs</a
				>.
			</div>
		</div>

		<div>
			<h1 class="mb-2 text-4xl font-bold text-primary">github stats</h1>
			<Stats {stars} {issues} {forks} />
		</div>

		<div class="mb-10">
			<div class="mb-2">
				<div class="flex h-full w-full items-center gap-2">
					<h1 class="mb-2 text-4xl font-bold text-primary">contribute</h1>
				</div>
				<div class="card rounded-lg border shadow-xl">
					<div class="card-body p-5">
						<p class="mt-2 text-xl text-primary">Contributions are welcome and appreciated!</p>
						<p class="mt-2 text-foreground/70">
							If you have any ideas for improvements, please fork the repository and submit a pull
							request.
						</p>
						<div class="justify-star mt-2 flex w-full gap-2">
							<a href={PUBLIC_REPOSITORY_URL} class="my-2 w-fit">
								<Button>
									<div class="flex items-center gap-2">
										go to repo
										<Icon icon="mdi-github" class="h-7 w-7" />
									</div>
								</Button>
							</a>
							<a href={`${PUBLIC_REPOSITORY_URL}/fork`} class="my-2 w-fit">
								<Button>
									<div class="flex items-center gap-2">
										create fork
										<Icon icon="carbon:fork" class="h-7 w-7" />
									</div>
								</Button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
