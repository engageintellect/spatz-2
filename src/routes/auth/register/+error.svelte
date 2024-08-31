<script lang="ts">
	import { page } from '$app/stores';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { animateMainStagger } from '$lib/animations';
	import Icon from '@iconify/svelte';

	onMount(() => {
		animateMainStagger();
	});
</script>

<div class="animate-item mx-auto w-full max-w-lg rounded-lg p-2 md:border md:p-5 md:shadow">
	<Alert.Root variant="destructive" class="animate-item">
		<Icon icon="mdi:alert-circle" class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{$page?.error?.message}</Alert.Description>
	</Alert.Root>

	<div class="animate-item mt-5 flex items-center gap-2">
		<Button variant="default" href="/auth/login" class="flex w-full items-center gap-2 lowercase">
			<Icon icon="mdi:plus" class="h-5 w-5" />
			<div>registration</div>
		</Button>
		<Button variant="outline" href="/auth/login" class="flex w-full items-center gap-2 lowercase">
			<div>login</div>
			<Icon icon="mdi:login" class="h-5 w-5" />
		</Button>
	</div>
</div>
