<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	let {
		trigger,
		content,
		title,
		description
	}: {
		trigger: () => any;
		content: () => any;
		title: () => any;
		description: () => any;
	} = $props();
</script>

<Drawer.Root>
	<Drawer.Trigger>
		<Button variant="link" size="sm" class="p-0 text-xs font-thin">
			{@render trigger()}
		</Button>
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>{@render title()}</Drawer.Title>
				<Drawer.Description>{@render description()}</Drawer.Description>
			</Drawer.Header>
			<div class="pb-0">
				{@render content()}
			</div>
			<Drawer.Footer>
				<Drawer.Close>
					<div class="flex w-full items-center justify-center gap-2">
						<Button
							variant="secondary"
							size="sm"
							class="flex w-full items-center justify-center gap-2"
						>
							<div>close</div>
							<Icon icon="mdi:close" class="h-5 w-5" />
						</Button>
					</div>
				</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
