<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
	import Form from '$lib/components/ui/Form.svelte';
	import { companyInfo } from '$lib/data.js';
</script>

<svelte:head>
	<title>Contact : {companyInfo.name}</title>
	<meta
		name="description"
		content={`Contact us for more information about our services. We are dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>
<div
	class="flex h-full w-full flex-col justify-center gap-5 rounded-lg p-5 sm:min-h-full md:flex-row md:justify-center md:border md:shadow-lg"
>
	<Form data={data.form} />
</div>
