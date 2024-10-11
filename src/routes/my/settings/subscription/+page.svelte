<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import { currentUser } from '$lib/stores/user';

	let isSubmitting = false;

	$: currentUser.set(data.user);

	export let data: {
		user: any;
		existingSubscriptions: Array<{
			id: string;
			status: string;
			plan: { id: string; amount: number; currency: string; interval: string };
			current_period_start: number;
			current_period_end: number;
			created: number;
			customer: string;
			latest_invoice: string;
		}>;
	};

	export let form: any;
	let loading: any;

	$: loading = false;
</script>

<div class="flex h-full w-full flex-col">
	<div class="text-2xl font-bold lowercase sm:text-3xl md:text-5xl">subscription</div>

	{#if data.existingSubscriptions.length > 0}
		<div class="mt-5 flex flex-col gap-5">
			{#each data.existingSubscriptions as subscription}
				<div class="animate-item text-lg text-muted-foreground">
					You are currently subscribed to the <span class="font-bold text-foreground"
						>{subscription?.plan?.interval}ly</span
					>
					plan for
					<span class="font-bold text-foreground"
						>${subscription?.plan?.amount / 100}
						<!-- {subscription?.plan?.currency.toUpperCase()} -->
					</span>.
				</div>

				<div class="animate-item flex w-fit items-center gap-2 rounded-lg border p-2">
					<div class="flex flex-col rounded-lg bg-success p-2">
						{new Date(subscription.current_period_start * 1000).toLocaleDateString()}
					</div>

					<Icon icon="mdi:arrow-right" class="h-5 w-5" />

					<div class="flex flex-col rounded-lg bg-destructive p-2">
						{new Date(subscription.current_period_end * 1000).toLocaleDateString()}
					</div>
				</div>

				<div class="animate-item">
					Subscription status: <span class="font-bold text-success">{subscription.status}</span>
				</div>

				{#if subscription.plan.active}
					<div class="animate-item text-success">Your subscription is active.</div>
				{:else}
					<div class="animate-item text-destructive">Your subscription is not active.</div>
				{/if}
			{/each}
		</div>
	{/if}

	{#if data.existingSubscriptions.length > 0}
		<div class="animate-item flex items-center gap-2 pt-5">
			<form
				class="w-full"
				method="POST"
				action="?/cancelSubscription"
				on:submit={() => (loading = true)}
				use:enhance={(result) => {
					console.log('result:', result);
					loading = false;
					toast.success('Subscription cancelled successfully.', {});
					invalidateAll();
				}}
			>
				<input type="hidden" name="subId" value={data.existingSubscriptions[0].id} />

				<div class="flex items-center gap-2">
					<Button
						class="flex w-full items-center gap-2"
						variant="destructive"
						type="submit"
						disabled={loading}
					>
						<div>cancel</div>
						<Icon icon="mdi:close" class="h-5 w-5" />
					</Button>
				</div>
			</form>

			<!-- +page.svelte -->

			<form
				action="?/manageSubscription"
				use:enhance={({ cancel }) => {
					if (isSubmitting) return cancel(); // Prevent multiple submissions
					isSubmitting = true;

					return async ({ result, update }) => {
						console.log('Registration result:', result.data.redirectUrl);
						await update();
						window.location.href = result.data.redirectUrl;
						isSubmitting = false;
					};
				}}
				method="POST"
			>
				<Button class="w-full" variant="default" type="submit">Manage Subscription</Button>
			</form>
		</div>
	{:else}
		<div class="mt-5 flex flex-col gap-5">
			<div>no current subscription</div>
			<div class="animate-item flex items-center gap-2">
				<Button variant="success" href="/subscriptions" class="flex w-fit items-center gap-2">
					<div>view subscriptions</div>
					<Icon icon="mdi:arrow-right" class="h-5 w-5" />
				</Button>
			</div>
		</div>
	{/if}
</div>
