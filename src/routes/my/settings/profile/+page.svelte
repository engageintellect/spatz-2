<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { getImageURL } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import { currentUser } from '$lib/stores/user';

	$: currentUser.set(data.user);

	export let data;
	export let form;
	let loading: any;

	$: loading = false;
	const showPreview = (event: any) => {
		const target = event.target;
		const files = target.files;

		if (files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview = document.getElementById('avatar-preview') as HTMLImageElement;
			if (preview) {
				preview.src = src;
			}
		}
	};

	const submitUpdateProfile = () => {
		loading = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					toast.success(`Job title updated.`, {});

					await invalidateAll();
					break;
				case 'error':
					toast.error('Failed to update job title.', {});
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex h-full w-full flex-col">
	<form
		action="?/updateProfile"
		method="POST"
		class="flex w-full flex-col space-y-2"
		enctype="multipart/form-data"
		use:enhance={submitUpdateProfile}
	>
		<div class="text-2xl font-bold lowercase sm:text-3xl md:text-5xl">Update Profile</div>
		<div class="w-full max-w-lg pt-5">
			<!-- <label for="avatar" class="label  pb-1"> -->
			<!-- <span class="label-text">Profile Picture</span> -->
			<!-- </label> -->
			<label
				for="avatar"
				class="avatar group mb-5 h-32 w-32 rounded-full transition-shadow duration-300 hover:cursor-pointer md:hover:shadow-lg"
			>
				<div class="relative mb-5 h-32 w-32 rounded-full">
					{#if data.user?.avatar}
						<img
							class="h-32 w-32 rounded-full border shadow"
							src={data.user?.avatar
								? getImageURL(data.user?.collectionId, data.user?.id, data.user?.avatar)
								: `https://ui-avatars.com/api/?name=${data.user?.email}`}
							alt="User avatar"
							id="avatar-preview"
						/>

						<label for="avatar" class=" absolute -bottom-0.5 -right-0.5 z-20 hover:cursor-pointer">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border bg-secondary transition-transform duration-300 md:group-hover:scale-105"
							>
								{#if data.user?.avatar}
									<Icon icon="mdi:pencil" class="h-5 w-5" />
								{:else}
									<Icon icon="mdi:plus" class="h-5 w-5" />
								{/if}
							</div>
						</label>
					{:else}
						<Icon
							icon="mdi-account-circle"
							class="text-base-100 h-full w-full scale-110 rounded-full bg-primary"
						/>
					{/if}
				</div>
			</label>
			<input
				type="file"
				name="avatar"
				id="avatar"
				value=""
				accept="image/*"
				hidden
				on:change={showPreview}
				disabled={loading}
			/>
			{#if form?.errors?.avatar}
				{#each form?.errors?.avatar as error}
					<label for="avatar" class="label py-0 pt-1">
						<span class="label-text-alt text-error">
							{error}
						</span>
					</label>
				{/each}
			{/if}
		</div>
		<Input
			id="name"
			value={form?.data?.name ?? data?.user?.name}
			disabled={loading}
			errors={form?.errors?.name}
			placeholder="Name"
		/>

		<Input
			id="job_title"
			value={form?.data?.job_title ?? data?.user?.job_title}
			disabled={loading}
			errors={form?.errors?.job_title}
			placeholder="Title"
		/>

		<Input
			id="website"
			value={form?.data?.website ?? data?.user?.website}
			disabled={loading}
			errors={form?.errors?.website}
			placeholder="Title"
		/>

		<div class="w-full max-w-lg pt-2">
			<div class="flex w-full justify-between gap-2">
				<Button
					class="flex w-full items-center gap-2 lowercase md:w-fit"
					type="submit"
					disabled={loading}
				>
					<Icon icon="material-symbols:sync" class={`${loading ? 'animate-spin' : ''} h-5 w-5`} />
					<div>update</div>
				</Button>

				<div class="w-full md:w-fit">
					<a href={`/users/${$currentUser.id}`} class="w-full">
						<Button variant="outline" class="flex w-full items-center gap-2 lowercase md:w-fit">
							<div>profile</div>
							<Icon icon="mdi:arrow-right" class={`${loading ? 'animate-spin' : ''} h-5 w-5`} />
						</Button>
					</a>
				</div>
			</div>
		</div>
	</form>
</div>
