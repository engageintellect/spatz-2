<script lang="ts">
	export let data;
	import { companyInfo } from '$lib/data';
</script>

<svelte:head>
	<title>Terms of Service</title>
	<meta name="description" content="Terms of Service for our website." />
</svelte:head>

<main class="mx-auto max-w-4xl p-8">
	<h1 class="mb-4 text-3xl font-bold">Terms of Service</h1>

	<p class="mb-4">Last updated: Mon Jul 15, 2024.</p>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">1. Introduction</h2>
		<p>
			Welcome to {companyInfo.name}! These terms of service govern your use of our site. By
			accessing or using our site, you agree to comply with these terms.
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">2. Information We Collect</h2>
		<p>
			We collect personal information that you provide to us when you fill out our form, including
			your name, email address, phone number, and message.
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">3. Use of Information</h2>
		<p>
			We use the information we collect to respond to your inquiries, provide services, and improve
			our website. We may also use your information to contact you with updates and promotional
			materials.
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">4. Sharing of Information</h2>
		<p>
			We do not share your personal information with third parties except as necessary to provide
			our services or as required by law.
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">5. Security</h2>
		<p>
			We take reasonable measures to protect the information you provide to us from unauthorized
			access and use.
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">6. Changes to These Terms</h2>
		<p>
			We may update these terms from time to time. We will notify you of any changes by posting the
			new terms on our site.
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">7. Contact Us</h2>
		<p>
			If you have any questions about these terms, please contact us at <a
				href={`mailto:${companyInfo.email}`}
				class="underline">{companyInfo.email}</a
			>.
		</p>
	</section>
</main>
