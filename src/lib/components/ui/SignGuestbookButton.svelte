<script lang="ts">
	import Icon from '@iconify/svelte';
	import ShineBorder from '$lib/components/magic-ui/ShineBorder.svelte';
</script>

<div class="flex w-full justify-center gap-2 px-10">
	<a href="/guestbook" class="group/signGuestbook w-full">
		<ShineBorder
			class="text-center text-lg lowercase shadow transition-all duration-300 md:hover:shadow-md"
			color={['#14b8a6', '#00000000']}
		>
			<div
				class="transition-scale flex items-center gap-2 duration-300 group-hover/signGuestbook:scale-105"
			>
				sign the guestbook
				<Icon
					icon="ion:chatbubble-outline"
					class="transition-color h-5 w-5 duration-300 md:group-hover/signGuestbook:text-teal-500"
				/>
			</div>
		</ShineBorder>
	</a>
</div>
