<script lang="ts">
	import type { PageData } from './$types.js';
	import Form from '$lib/components/ui/Form.svelte';
	import { siteInfo } from '$lib/data.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed
	interface Props {
		data: PageData;
	}

	let sidebar = useSidebar();

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Contact : {siteInfo.name}</title>
	<meta
		name="description"
		content={`Contact us for more information about our services. We are dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>
<div
	class={`${sidebar.state === 'expanded' ? 'lg:flex-row lg:justify-center lg:border lg:shadow-lg' : 'md:flex-row md:justify-center md:border md:shadow-lg'} flex w-full flex-col justify-center gap-5 rounded-lg p-5`}
>
	<Form data={data.form} action={'/contact?'} />
</div>
