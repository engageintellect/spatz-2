<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	export let form;
</script>

<div class="flex h-full w-full flex-col">
	<div class="w-full">
		<form action="?/updatePassword" method="POST" class="flex w-full flex-col space-y-2">
			<div class="text-3xl font-bold lowercase md:text-5xl">Change Password</div>
			<div class="divider" />
			<Input
				id="oldPassword"
				type="password"
				required
				errors={form?.errors?.oldPassword}
				placeholder="Current Password"
			/>
			<Input
				id="password"
				type="password"
				required
				errors={form?.errors?.password}
				placeholder="New Password"
			/>
			<Input
				id="passwordConfirm"
				type="password"
				required
				errors={form?.errors?.passwordConfirm}
				placeholder="Confirm Password"
			/>
			<a
				href="/auth/reset-password"
				class="hover:cursor-point text-sm text-primary hover:underline"
			>
				I forgot my password</a
			>
			<div class="w-full max-w-lg pt-2">
				<Button type="submit" class="w-full max-w-lg lowercase">Update Password</Button>
			</div>
		</form>
	</div>
</div>
