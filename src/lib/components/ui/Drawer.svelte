<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	export let title = 'Move Goal';
	export let description = 'Set your daily activity goal.';
</script>

<Drawer.Root>
	<Drawer.Trigger asChild let:builder>
		<Button builders={[builder]} variant="link" size="sm" class="p-0 text-xs font-thin">
			<slot name="trigger" />
		</Button>
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>{title}</Drawer.Title>
				<Drawer.Description>{description}</Drawer.Description>
			</Drawer.Header>

			<slot name="content" />
			<div class="p-4 pb-0">
				<div class="flex items-center justify-center space-x-2"></div>
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
