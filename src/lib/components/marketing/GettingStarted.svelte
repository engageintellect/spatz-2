<script lang="ts">
	import { PUBLIC_DOCS_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { toast } from '$lib/stores/toast'; // Import the toast store
	import Toast from '$lib/components/ui/Toast.svelte';

	function copyToClipboard(content: string) {
		navigator.clipboard.writeText(content).then(
			() => {
				toast.set({
					show: true,
					message: 'Command copied to clipboard',
					type: 'bg-emerald-300 text-emerald-900'
				});
				setTimeout(() => toast.set({ show: false, message: '', type: '' }), 2000);
			},
			(err) => console.error('Could not copy text: ', err)
		);
	}
</script>

<div>
	<h1 class="mb-2 text-4xl font-bold">getting started</h1>
	<p>It's quick and easy to get started. 5 minutes is all it takes.</p>

	<div class="flex items-center gap-2">
		<a href={PUBLIC_DOCS_URL} class="">
			<Button class="">
				<div class="flex items-center gap-2">
					<div>spatz docs</div>
					<Icon icon="mdi:github" class="h-5 w-5" />
				</div>
			</Button>
		</a>

		<a
			href="https://github.com/new?template_name=spatz-2&template_owner=engageintellect"
			class="my-2 w-fit"
		>
			<Button variant="default" class="w-full bg-teal-500 hover:bg-teal-400">
				<div class="flex items-center gap-2">
					use template
					<Icon icon="mdi-download" class="h-5 w-5" />
				</div>
			</Button>
		</a>
	</div>

	<div class="mb-10">
		<h1 class="mt-10 text-2xl font-bold">Sveltekit Config</h1>
		<p class="mt-2">Run the below commands to get started.</p>
		<div class="mt-5 flex flex-col gap-2">
			<div class=""># clone repo and navigate to directory</div>
			<div class="relative overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
				<button
					type="button"
					class="w-full text-left"
					on:click={() => copyToClipboard('git clone https://github.com/engageintellect/spatz')}
				>
					$ git clone https://github.com/engageintellect/spatz
				</button>
			</div>
			<div class=""># copy .env.example and replace values with your own</div>
			<div class="relative overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
				<button
					type="button"
					class="w-full text-left"
					on:click={() => copyToClipboard('cp .env.example .env.local')}
				>
					$ cp .env.example .env.local
				</button>
			</div>
			<div class=""># install dependencies and run dev server</div>

			<div class="relative overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
				<button
					type="button"
					class="w-full text-left"
					on:click={() => copyToClipboard('pnpm i && pnpm run dev --host')}
				>
					$ pnpm i && pnpm run dev --host
					<div data-prefix=">" class="text-yellow-500">installing...</div>
					<div data-prefix="" class="text-emerald-500">
						server running on: http://localhost:5173
					</div>
				</button>
			</div>
		</div>
	</div>

	<div>
		<h1 class="text-xl font-bold">Pocketbase Config</h1>
		<p class="mt-2">Run the below commands to get started.</p>
		<div>
			<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
				<button
					type="button"
					class="w-full whitespace-nowrap text-left"
					on:click={() =>
						copyToClipboard(
							'wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_linux_amd64.zip'
						)}
				>
					$ wget
					https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_linux_amd64.zip
				</button>
			</div>
			<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
				<button
					type="button"
					class="w-full text-left"
					on:click={() => copyToClipboard('unzip pocketbase_0.22.9_linux_amd64.zip')}
				>
					$ unzip pocketbase_0.22.9_linux_amd64.zip
				</button>
			</div>
		</div>

		<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
			<button
				type="button"
				class="w-full text-left"
				on:click={() => copyToClipboard('./pocketbase serve --http="0.0.0.0:8090"')}
			>
				$ ./pocketbase serve --http="0.0.0.0:8090"
			</button>
		</div>
	</div>

	<p class="mt-5">
		Log into the Pocketbase Admin UI <a
			class="text-blue-500 text-primary"
			href="http://localhost:8090/_/">http://localhost:8090/_/</a
		>
	</p>
	<p class="mt-5">
		Go to settings > Import collections, then paste in the contents of ./pocketbase/pb_schema.json
	</p>
	<p class="mt-5">
		Visit app in browser <a class="text-blue-500" href="http://localhost:5173"
			>http://localhost:5173</a
		>
	</p>
	<div class="mt-5">
		For more information, check out the <a class="text-blue-500" href={PUBLIC_DOCS_URL}>docs</a>.
	</div>
</div>

<Toast type={$toast.type} message={$toast.message} show={$toast.show} />
