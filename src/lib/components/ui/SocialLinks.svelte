<script lang="ts">
	import Icon from '@iconify/svelte';
	import { companyInfo } from '$lib/data';
</script>

<div class="my-5 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-10">
	<a href={companyInfo.socials.instagram.url} class="flex items-center justify-center gap-2">
		<Icon icon="skill-icons:instagram" class="h-12 w-12" />
		<div class="text-3xl font-thin">{companyInfo.socials.instagram.username}</div>
	</a>

	<a href={companyInfo.socials.tiktok.url} class="flex items-center justify-center gap-2">
		<Icon icon="logos:tiktok-icon" class="h-12 w-12" />
		<div class="text-3xl font-thin">{companyInfo.socials.tiktok.username}</div>
	</a>
</div>
