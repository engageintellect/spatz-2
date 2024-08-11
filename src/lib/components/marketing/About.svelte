<script lang="ts">
	import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
	import Animate from '$lib/components/ui/Animate.svelte';
</script>

<Animate>
	<div class="">
		<h1 class="mb-2 text-4xl font-bold">about</h1>
		<p class="mt-2 text-lg">
			<a href={PUBLIC_REPOSITORY_URL} class="underline">spatz</a>
			is ready, out of the box to help you build your next great idea. It includes all the features you
			need to get started, and move quickly:
		</p>
		<ul class="mt-2 list-disc pl-10">
			<li>User Authentication</li>
			<li>Databases & Content Management</li>
			<li>Admin Dashboards</li>
			<li>User Settings & Profile panels</li>
			<li>Themes & Styling</li>
			<li>Forms & Form Validation</li>
			<li>Toast Notifications</li>
			<li>Icons</li>
		</ul>
	</div>
</Animate>
