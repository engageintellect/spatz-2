<script lang="ts">
	import { useChat } from 'ai/svelte';
	import { fade } from 'svelte/transition';
	import { onMount, afterUpdate } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { getImageURL } from '$lib/utils';
	import { chatMessages } from '$lib/stores/chatMessages';
	import { get } from 'svelte/store';
	import { PUBLIC_OPENAI_MODEL } from '$env/static/public';
	import robot from '$lib/assets/images/robot14-nobg.png';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import Icon from '@iconify/svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toast } from '$lib/stores/toast'; // Import the toast store
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button/index.js';

	let messagesEnd: HTMLElement;
	let inputElement: HTMLInputElement;
	const { input, handleSubmit: originalHandleSubmit, messages, setMessages } = useChat();
	let initialLoadComplete = false;

	onMount(() => {
		const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
		setMessages(savedMessages);
		initialLoadComplete = true;
		scrollToBottom();

		// Set focus on the input element for medium or larger screen sizes
		if (window.matchMedia('(min-width: 768px)').matches) {
			inputElement.focus();
		}
	});

	afterUpdate(() => {
		animateNewMessages();
	});

	async function handleSubmit(event: any) {
		event.preventDefault();
		await originalHandleSubmit(event);
		chatMessages.set(get(messages));
		scrollToBottom();
		animateNewMessages();
	}

	function clearChat() {
		setMessages([]); // Clear the messages state
		chatMessages.set([]);
		localStorage.removeItem('chatMessages');
	}

	$: {
		if (initialLoadComplete) {
			chatMessages.set($messages);
			scrollToBottom();
		}
	}

	function scrollToBottom() {
		messagesEnd?.scrollIntoView({ behavior: 'smooth' });
	}

	function copyToClipboard(content: string) {
		navigator.clipboard.writeText(content).then(
			() => {
				toast.set({
					show: true,
					message: 'Message copied to clipboard',
					type: 'success'
				});
				setTimeout(() => toast.set({ show: false, message: '', type: '' }), 2000);
			},
			(err) => console.error('Could not copy text: ', err)
		);
	}

	function animateNewMessages() {
		const messages = document.querySelectorAll('.chat');
		messages.forEach((message, index) => {
			if (!message.classList.contains('animated')) {
				gsap.fromTo(
					message,
					{ opacity: 0, y: 25 },
					{
						opacity: 1,
						y: 0,
						duration: 1,
						ease: 'power4.out',
						delay: index * 0.05
					}
				);
				message.classList.add('animated');
			}
		});
	}
</script>

<section>
	{#if $messages.length < 1}
		<div class="flex w-full flex-col">
			<div in:fade={{ delay: 0, duration: 300 }} class="my-2 flex items-center gap-2 md:mt-0">
				<Icon icon="simple-icons:openai" class="h-7 w-7" />
				<h1 class="text-2xl font-thin">{PUBLIC_OPENAI_MODEL}</h1>
			</div>
		</div>
	{/if}

	<div class="sticky top-[57px] z-10 w-full backdrop-blur-sm">
		<form class="w-full bg-background py-2" on:submit={handleSubmit}>
			<div class="flex w-full gap-2">
				<input
					placeholder="Enter your query"
					bind:value={$input}
					class="w-full rounded-lg border p-2 focus-within:outline-none focus:outline-none"
					bind:this={inputElement}
				/>
				<Button type="submit" variant="outline" class="">
					<div class="flex items-center gap-2">
						<Icon icon="mdi-send" class="h-7 w-7" />
					</div>
				</Button>
				{#if $messages.length > 0}
					<div in:fade={{ duration: 300 }}>
						<Button type="button" variant="destructive" class="" on:click={clearChat}>
							<div class="flex items-center gap-2">
								<Icon icon="mdi-delete" class="h-7 w-7" />
							</div>
						</Button>
					</div>
				{/if}
			</div>
		</form>
	</div>

	<div class="-z-10 w-full py-5 md:p-5">
		<div class="flex w-full flex-col gap-5">
			{#each $messages as message}
				<div class={`flex items-start gap-2`}>
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img
								src={message.role === 'user'
									? $currentUser?.avatar
										? getImageURL(
												$currentUser?.collectionId,
												$currentUser?.id,
												$currentUser?.avatar
											)
										: `https://ui-avatars.com/api/?name=${$currentUser?.email}`
									: robot}
								alt={message.role === 'user' ? 'User avatar' : 'Tailwind CSS chat bubble component'}
								class={`rounded-full ${message.role === 'assistant' ? 'scale-x-[-1] bg-orange-500' : ''}`}
							/>
						</div>
					</div>
					<div class="flex flex-col">
						<div class="chat-header">
							{message.role === 'user'
								? $currentUser
									? '@' + $currentUser?.username
									: 'no'
								: '@chatGPT'}
							<time class="text-neutral-content/50 text-xs">{new Date().toLocaleTimeString()}</time>
						</div>

						<div
							class={`card shadow ${message.role === 'user' ? 'rounded-lg border' : 'rounded-lg bg-secondary'}`}
						>
							<div class="card-body px-4 py-2">
								{@html message.content}
							</div>
						</div>
						<div class="chat-footer opacity-50">
							<div class="mt-1 flex items-center gap-2">
								<button on:click={() => copyToClipboard(message.content)} class="">
									<div class="flex items-center gap-1">
										<Icon icon="mdi-content-copy" class="h-4 w-4" />
										<div class="text-xs">copy</div>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div bind:this={messagesEnd}></div>
	</div>
</section>

<div class="flex justify-end">
	<ScrollToTopButton />
</div>

<Toast type={$toast.type} message={$toast.message} show={$toast.show} />
