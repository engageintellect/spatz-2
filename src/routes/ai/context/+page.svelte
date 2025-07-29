<script lang="ts">
	import { useChat } from '@ai-sdk/svelte';
	import { fade } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { getImageURL } from '$lib/utils';
	import { contextChatMessages } from '$lib/stores/contextChatMessages';
	import { get } from 'svelte/store';
	import { PUBLIC_OPENAI_MODEL } from '$env/static/public';
	import robot from '$lib/assets/images/robot14-nobg.png';
	import Icon from '@iconify/svelte';
	import { toast } from '$lib/stores/toast';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button/index.js';

	let messagesEnd: HTMLElement;
	let inputElement: HTMLInputElement;
	let customContext = `Explain it to me like I'm 5....`; // New context input state

	const { input, handleSubmit: originalHandleSubmit, messages, setMessages } = useChat();
	let initialLoadComplete = false;

	onMount(() => {
		tick();
		const savedMessages = JSON.parse(localStorage.getItem('contextChatMessages') || '[]');
		setMessages(savedMessages);
		initialLoadComplete = true;
		scrollToBottom();

		// Set focus on the input element for medium or larger screen sizes
		if (window.matchMedia('(min-width: 768px)').matches) {
			inputElement.focus();
		}
	});

	async function handleSubmit(event: any) {
		event.preventDefault();

		// Modify the request to include the custom context

		originalHandleSubmit(event, {
			body: { customPrePrompt: customContext }
		});

		contextChatMessages.set(get(messages));
		scrollToBottom();
		animateNewMessages();
	}

	function clearChat() {
		setMessages([]); // Clear the messages state
		contextChatMessages.set([]);
		localStorage.removeItem('contextChatMessages');
	}

	$: {
		if (initialLoadComplete) {
			contextChatMessages.set($messages);
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
					type: 'bg-background',
					icon: 'material-symbols:content-copy-outline'
				});
				setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
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

	<div class="sticky top-[57px] z-10 w-full border-b backdrop-blur-sm">
		<form class="w-full bg-background py-2" onsubmit={handleSubmit}>
			<input
				placeholder="Enter your custom context..."
				bind:value={customContext}
				class="w-full rounded-lg border bg-card p-2 focus-within:outline-none focus:outline-none"
			/>

			<div class="mt-2 flex w-full gap-2">
				<input
					placeholder="Enter your query"
					bind:value={$input}
					class="w-full rounded-lg border bg-card p-2 focus-within:outline-none focus:outline-none"
					bind:this={inputElement}
				/>

				<div class="flex gap-2">
					<Button type="submit" variant="default">
						<div class="flex items-center gap-2">
							<Icon icon="mdi:send" class="h-5 w-5" />
						</div>
					</Button>
					{#if $messages.length > 0}
						<Button type="button" variant="destructive" onclick={clearChat}>
							<div class="flex items-center gap-2">
								<Icon icon="mdi:delete" class="h-5 w-5" />
							</div>
						</Button>
					{/if}
				</div>
			</div>
		</form>
	</div>

	<div class="-z-10 w-full py-5 md:p-5">
		<div class="flex w-full flex-col gap-5">
			{#if $messages.length < 1}
				<div class="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
					<div>
						This is a chatbot that uses the OpenAI API to generate responses. Ask me anything!
					</div>

					<div>
						It has an extra feature that allows you to provide a custom context for the model to
						consider when generating responses. Try it out!
					</div>

					<div>
						The model is currently set to <strong class="pl-1 text-primary"
							>"{PUBLIC_OPENAI_MODEL}"</strong
						>. You can change the model by setting the
						<code class="text-primary">PUBLIC_OPENAI_MODEL</code>
						environment variable in your
						<code>.env</code> file.
					</div>
				</div>
			{/if}

			{#each $messages as message}
				<div in:fade={{ duration: 250 }} class={`chat flex items-start gap-2`}>
					<div class="chat-image avatar">
						<div in:fade={{ delay: 0, duration: 500 }} class="mt-2 w-10 rounded-full">
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
							{message.role === 'user' ? ($currentUser ? $currentUser?.username : 'no') : 'spatz'}
							<time class="text-neutral-content/50 text-xs">{new Date().toLocaleTimeString()}</time>
						</div>

						<div
							class={`card mt-1 shadow ${message.role === 'user' ? 'rounded-lg border' : 'rounded-lg bg-secondary'}`}
						>
							<div class="card-body px-4 py-2">
								{@html message.content}
							</div>
						</div>
						<div class="chat-footer opacity-50">
							<div class="mt-1 flex items-center gap-2">
								<button onclick={() => copyToClipboard(message.content)} class="">
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
