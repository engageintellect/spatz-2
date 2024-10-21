<script lang="ts">
	import type { PageData } from './$types.js';
	import SpatzLanding from '$lib/components/ui/SpatzLanding.svelte';
	import { siteInfo } from '$lib/data.js';
	import { currentUser } from '$lib/stores/user.js';
	import SpatzMarketing from '$lib/components/ui/SpatzMarketing.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Home : {siteInfo.name}</title>
	<meta
		name="description"
		content={`${siteInfo.name} is dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>

<div class="flex flex-col gap-10 md:gap-20">
	<!-- IF USER IS NOT LOGGED IN -->
	{#if !$currentUser}
		<SpatzLanding formData={data.form} />
		<!-- IF USER IS LOGGED IN -->
	{:else}
		<div>
			<SpatzMarketing />
		</div>
	{/if}
</div>
