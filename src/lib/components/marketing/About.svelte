<script lang="ts">
	import { PUBLIC_REPOSITORY_URL } from '$env/static/public';
	import Animate from '$lib/components/ui/Animate.svelte';
	import Icon from '@iconify/svelte';
</script>

<Animate>
	<div class="">
		<h1 class="mb-2 text-4xl font-bold">about</h1>
		<p class="mt-2 text-lg text-muted-foreground">
			<a href={PUBLIC_REPOSITORY_URL} class="text-info underline">spatz</a>
			is ready, out of the box to help you build your next great idea. It includes all the features you
			need to get started, and move quickly:
		</p>
		<ul class="mt-2 pl-10 text-muted-foreground">
			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>User Authentication</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Databases & Content Management</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Stripe Payments & Subscriptions</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Admin Dashboards & Logging</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>User Settings & Profile panels</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>OpenAI Integration</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Themes & Styling</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Forms & Form Validation</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Optimistic UI rendering</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Toast Notifications</li>
			</div>

			<div class="flex items-center gap-2">
				<Icon icon="mdi-done" class="text-success" />
				<li>Icons</li>
			</div>
		</ul>
	</div>
</Animate>
