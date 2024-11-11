<script lang="ts">
	import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	let sidebar = useSidebar();
</script>

<div class="mb-2">
	<div class="flex h-full w-full items-center gap-2">
		<h1 class="mb-2 text-4xl font-bold text-primary">contribute</h1>
	</div>

	<div class="">
		<div class="card rounded-lg border shadow">
			<div class="card-body p-5">
				<div
					class={`${sidebar.state === 'expanded' ? 'lg:flex-row' : 'md:flex-row'} flex flex-col`}
				>
					<div>
						<p class="mt-2 text-xl text-primary">Contributions are welcome and appreciated!</p>
						<p class="mt-2 text-muted-foreground">
							If you have any ideas for improvements, please fork the repository and submit a pull
							request.
						</p>
						<p class="mt-2 text-foreground/70">
							Or, check out one of the <a
								href={`${PUBLIC_REPOSITORY_URL}/issues`}
								class="text-info underline">open issues</a
							>.
						</p>

						<div class="justify-star mt-2 flex w-full gap-2">
							<a href={PUBLIC_REPOSITORY_URL} class="my-2 w-fit">
								<Button>
									<div class="flex items-center gap-2">
										go to repo
										<Icon icon="mdi-github" class="h-5 w-5" />
									</div>
								</Button>
							</a>
							<a href={`${PUBLIC_REPOSITORY_URL}/fork`} class="my-2 w-fit">
								<Button>
									<div class="flex items-center gap-2">
										create fork
										<Icon icon="carbon:fork" class="h-5 w-5" />
									</div>
								</Button>
							</a>
						</div>
					</div>

					<div>
						<Icon icon="vscode-icons:folder-type-github" class="h-40 w-40 drop-shadow" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
