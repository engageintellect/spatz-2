<script lang="ts">
	import Icon from '@iconify/svelte';
	import { pb } from '$lib/pocketbase';

	import { onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import { goto } from '$app/navigation';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed

	let open = $state(false);
	const sidebar = useSidebar();

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			} else if (e.key === 'Escape' && open) {
				e.preventDefault();
				open = false;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const handleSelect = (value: string, url: string) => {
		console.log('Selected', value);
		goto(url);
		open = false;
	};

	function handleLogout() {
		open = false;
		pb.authStore.clear();
		localStorage.removeItem('chatMessages');
		goto('/');
	}
</script>

<Command.Dialog bind:open class="h-full min-h-80">
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>

		<Command.Group heading="Suggestions">
			<Command.Item onSelect={() => handleSelect('/', '/#')}>
				<Icon icon="mdi:home" class="mr-2 h-4 w-4" />
				<span>/</span>
			</Command.Item>

			<Command.Item onSelect={() => handleSelect('Guestbook', '/guestbook')}>
				<Icon icon="material-symbols:dynamic-feed" class="mr-2 h-4 w-4" />
				<span>Guestbook</span>
			</Command.Item>

			<Command.Item onSelect={() => handleSelect('Chat', '/ai/chat')}>
				<Icon icon="hugeicons:ai-brain-03" class="mr-2 h-4 w-4" />
				<span>AI</span>
			</Command.Item>

			<Command.Item onSelect={() => handleLogout()}>
				<Icon icon="mdi:logout" class="mr-2 h-4 w-4" />
				<span>logout</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
