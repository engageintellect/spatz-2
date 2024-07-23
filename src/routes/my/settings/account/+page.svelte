<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	// import Modal from '$lib/components/Modal.svelte'
	import { toast } from '$lib/stores/toast';
	// import Toast from '$lib/components/Toast.svelte'

	export let form;
	export let data;
	let emailModalOpen: any;
	let usernameModalOpen: any;
	let loading: any;

	$: emailModalOpen = false;
	$: usernameModalOpen = false;
	$: loading = false;

	const submitUpdateEmail = () => {
		loading = true;
		emailModalOpen = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					toast.set({
						show: true,
						message: 'Email updated successfully',
						type: 'success'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '' }), 2000);
					break;
				case 'error':
					await invalidateAll();
					toast.set({
						show: true,
						message: 'Email update failed',
						type: 'error'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '' }), 2000);
					break;
				default:
					await applyAction(result);
			}
			emailModalOpen = false;
			loading = false;
		};
	};

	const submitUpdateUsername = () => {
		loading = true;
		usernameModalOpen = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					toast.set({
						show: true,
						message: 'Profile updated successfully',
						type: 'success'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '' }), 2000);
					await invalidateAll();
					break;
				case 'error':
					toast.set({
						show: true,
						message: 'Profile update failed',
						type: 'error'
					});
					setTimeout(() => toast.set({ show: false, message: '', type: '' }), 2000);
					break;
				default:
					await applyAction(result);
			}
			loading = false;
			usernameModalOpen = false;
		};
	};
</script>

<div class="flex h-full w-full flex-col space-y-12">
	<div class="w-full">
		<div class="text-2xl">Change Email</div>
		<div class="divider mt-2" />

		<Input id="email" value={data?.user?.email} disabled={true} errors={form?.errors?.email} />

		<!-- <Modal label="change-email" checked={emailModalOpen}>
      <span slot="trigger" class="btn btn-primary">Change Email</span>
      <div slot="heading">Change Your Email</div>
      <form
        action="?/updateEmail"
        method="POST"
        class="space-y-2"
        use:enhance={submitUpdateEmail}
      >
        <Input
          id="email"
          type="email"
          required={true}
          value={form?.data?.email}
         disabled={loading}
          errors={form?.errors?.email}
        />
        <button type="submit" class="btn btn-primary w-full" disabled={loading}
          >Save</button
        >
      </form>
    </Modal> -->
	</div>
	<div class="w-full">
		<div class="text-2xl">Change Username</div>
		<div class="divider mt-2" />
		<Input
			id="username"
			value={data?.user?.username}
			disabled={true}
			errors={form?.errors?.username}
		/>
		<!-- <Modal label="change-username" checked={usernameModalOpen}>
      <span slot="trigger" class="btn btn-primary">Change Username</span>
      <div slot="heading">Change Your Username</div>
      <form
        action="?/updateUsername"
        method="POST"
        class="space-y-2"
        use:enhance={submitUpdateUsername}
      >
        <Input
          id="username"
          type="text"
          required={true}
          value={form?.data?.username}
          errors={form?.errors?.username}
          disabled={loading}
        />
        <button type="submit" class="btn btn-primary w-full" disabled={loading}
          >Save</button
        >
      </form>
    </Modal> -->
	</div>
</div>

<!-- <Toast type={$toast.type} message={$toast.message} show={$toast.show} /> -->
