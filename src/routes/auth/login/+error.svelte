<script lang="ts">
	import { page } from '$app/stores';
	import Toast from '$lib/components/ui/Toast.svelte';

	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<div class="mx-auto w-full max-w-lg">
	<Alert.Root variant="destructive">
		<CircleAlert class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{$page?.error?.message}</Alert.Description>
	</Alert.Root>

	<div class="mt-5 flex items-center gap-2">
		<Button variant="default" href="/auth/login" class="lowercase">Back to login</Button>
		<Button variant="outline" href="/auth/register" class="lowercase">create account</Button>
	</div>
</div>
