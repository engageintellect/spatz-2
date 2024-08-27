<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/stores/toast';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	export let form;
	export let data;
	let loading: any;

	$: loading = false;

	const submitUpdateEmail = () => {
		loading = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					toast.set({
						show: true,
						message: 'Email updated successfully',
						type: 'bg-success',
						icon: 'mdi:check'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
					break;
				case 'error':
					await invalidateAll();
					toast.set({
						show: true,
						message: 'Email update failed',
						type: 'error',
						icon: 'mdi:alert-circle'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const submitUpdateUsername = () => {
		loading = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					toast.set({
						show: true,
						message: 'Profile updated successfully',
						type: 'bg-success text-success-foreground',
						icon: 'mdi:check'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
					await invalidateAll();
					break;
				case 'error':
					toast.set({
						show: true,
						message: 'Profile update failed',
						type: 'bg-destructive text-destructive-foreground',
						icon: 'mdi:alert-circle'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '', icon: '' }), 2000);
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex h-full w-full flex-col space-y-12">
	<div class="w-full">
		<div class="mb-5 text-3xl font-bold lowercase md:text-5xl">account settings</div>
		<div class="text-2xl">Change Email</div>

		<!-- <Modal label="change-email" checked={emailModalOpen}> -->
		<form
			action="?/updateEmail"
			method="POST"
			class="mt-2 space-y-2"
			use:enhance={submitUpdateEmail}
		>
			<Input
				id="email"
				type="email"
				required={true}
				placeholder={data?.user?.email}
				value={form?.data?.email}
				disabled={loading}
				errors={form?.errors?.email}
			/>
			<Button type="submit" variant="default" class="lowercase" disabled={loading}
				>update email</Button
			>
		</form>
	</div>

	<div class="w-full">
		<div class="text-2xl">Change Username</div>
		<form
			action="?/updateUsername"
			method="POST"
			class="mt-2 space-y-2"
			use:enhance={submitUpdateUsername}
		>
			<Input
				id="username"
				type="text"
				placeholder={data?.user?.username}
				required={true}
				value={form?.data?.username}
				errors={form?.errors?.username}
				disabled={loading}
			/>
			<Button type="submit" variant="default" class="lowercase" disabled={loading}
				>Save username</Button
			>
		</form>
	</div>
</div>

<Toast type={$toast.type} message={$toast.message} show={$toast.show} />
