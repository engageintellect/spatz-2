<script lang="ts">
	import Form from '$lib/components/ui/Form.svelte';
	import AboutCard from '$lib/components/landing-page/AboutCard.svelte';
	import Hero from '$lib/components/landing-page/Hero.svelte';
	import Quote from '$lib/components/landing-page/Quote.svelte';
	import SkillsCard from '$lib/components/landing-page/SkillsCard.svelte';
	interface Props {
		formData: any;
	}

	let { formData }: Props = $props();
</script>

<div class="leading-relaxed">
	<Hero />
	<AboutCard />
	<SkillsCard />
	<Quote />
	<div
		class="mb-5 flex h-full w-full flex-col justify-center gap-5 border-t p-5 transition-all duration-500 sm:min-h-full md:mb-20 md:flex-row md:justify-center md:rounded-lg md:border md:shadow-lg"
	>
		<Form data={formData} action={'/contact?'} />
	</div>
</div>
