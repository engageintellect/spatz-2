<script lang="ts">
	import { PUBLIC_DOCS_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { toast } from '$lib/stores/toast'; // Import the toast store
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	function copyToClipboard(content: string) {
		navigator.clipboard.writeText(content).then(
			() => {
				toast.set({
					show: true,
					message: 'Command copied to clipboard',
					type: 'bg-background border',
					icon: 'material-symbols:content-copy-outline'
				});
				setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
			},
			(err) => console.error('Could not copy text: ', err)
		);
	}
</script>

<div id="getting-started">
	<h1 class="mb-2 text-4xl font-bold">getting started</h1>

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

	<div class="my-5 leading-relaxed text-muted-foreground">
		<p>
			spatz comes in two pieces, a web app (Sveltekit) and a backend (PocketBase). You can run the
			client the using Vercel, Netflify, Docker, or however you usually run a Sveltekit app. The
			backend can run on your own server or VPS as a single service, and reverse-proxied using
			something like Nginx.
		</p>
	</div>

	<Accordion.Root class="mt-2 w-full">
		<Accordion.Item value="item-1">
			<Accordion.Trigger class="text-lg font-bold lowercase">Sveltekit Config</Accordion.Trigger>
			<Accordion.Content>
				<div class="">
					<!-- <h1 class="text-2xl font-bold">Sveltekit Config</h1> -->
					<p class="mt-2">Run the below commands to get started.</p>
					<div class="mt-5 flex flex-col gap-2">
						<div class="">1. Clone repo and navigate to directory</div>
						<div class="relative overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
							<button
								type="button"
								class="w-full text-left"
								onclick={() =>
									copyToClipboard('git clone https://github.com/engageintellect/spatz')}
							>
								$ git clone https://github.com/engageintellect/spatz
							</button>
						</div>
						<div class="mt-5">2. Copy .env.example and replace values with your own</div>
						<div class="relative overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
							<button
								type="button"
								class="w-full text-left"
								onclick={() => copyToClipboard('cp .env.example .env.local')}
							>
								$ cp .env.example .env.local
							</button>
						</div>
						<div class="mt-5">3. Install dependencies and run dev server</div>

						<div class="relative overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
							<button
								type="button"
								class="w-full text-left"
								onclick={() => copyToClipboard('pnpm i && pnpm run dev --host')}
							>
								<div class="flex flex-col gap-2">
									<div>$ pnpm i && pnpm run dev --host</div>
									<div data-prefix=">" class="text-yellow-500">installing...</div>
									<div data-prefix="" class="text-success">
										server running on: http://localhost:5173
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger class="text-lg font-bold lowercase">PocketBase Config</Accordion.Trigger>
			<Accordion.Content>
				<div>
					<!-- <h1 class="text-xl font-bold">Pocketbase Config</h1> -->
					<p class="mt-2">
						Go to the<a
							href="https://github.com/pocketbase/pocketbase/releases"
							class="mx-1 border-b border-info text-info">pocketbase release</a
						>page to download the latest version of pocketbase.
					</p>

					<p class="mt-5">1. Run the below commands to get started.</p>
					<div>
						<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
							<button
								type="button"
								class="w-full whitespace-nowrap text-left"
								onclick={() =>
									copyToClipboard(
										'wget https://github.com/pocketbase/pocketbase/releases/download/v0.23.4/pocketbase_0.23.4_linux_amd64.zip'
									)}
							>
								$ wget
								https://github.com/pocketbase/pocketbase/releases/download/YOUR_VERSION/YOUR_DOWNLOAD.zip
							</button>
						</div>

						<p class="mt-5">2. Here is an example:</p>
						<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
							<button
								type="button"
								class="w-full whitespace-nowrap text-left"
								onclick={() =>
									copyToClipboard(
										'wget https://github.com/pocketbase/pocketbase/releases/download/v0.23.4/pocketbase_0.22.9_linux_amd64.zip'
									)}
							>
								$ wget
								https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_linux_amd64.zip
							</button>
						</div>

						<p class="mt-5">3. Then unzip the file:</p>
						<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
							<button
								type="button"
								class="w-full text-left"
								onclick={() => copyToClipboard('unzip pocketbase_0.22.9_linux_amd64.zip')}
							>
								$ unzip pocketbase_0.22.9_linux_amd64.zip
							</button>
						</div>
					</div>

					<p class="mt-5">4. Then run the following command:</p>
					<div class="relative my-2 overflow-x-auto rounded-md bg-neutral-800 p-4 text-white">
						<button
							type="button"
							class="w-full text-left"
							onclick={() => copyToClipboard('./pocketbase serve --http="0.0.0.0:8090"')}
						>
							$ ./pocketbase serve --http="0.0.0.0:8090"
						</button>
					</div>
				</div>

				<p class="mt-5">
					Log into the Pocketbase Admin UI <a
						class="border-b border-info text-info"
						href="http://localhost:8090/_/">http://localhost:8090/_/</a
					>
				</p>
				<p class="mt-5">
					Go to settings > Import collections, then paste in the contents of
					./pocketbase/pb_schema.json
				</p>
				<p class="mt-5">
					Visit app in browser <a
						class="border-b border-info text-info"
						href="http://localhost:5173">http://localhost:5173</a
					>
				</p>
			</Accordion.Content>
		</Accordion.Item>
		<!-- <Accordion.Item value="item-3">
			<Accordion.Trigger>Is it animated?</Accordion.Trigger>
			<Accordion.Content>
				Yes. It's animated by default, but you can disable it if you prefer.
			</Accordion.Content>
		</Accordion.Item> -->
	</Accordion.Root>
</div>
