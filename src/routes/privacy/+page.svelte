<script>
	export let data;
	import { companyInfo } from '$lib/data';
</script>

<svelte:head>
	<title>Privacy Policy</title>
	<meta name="description" content="Privacy Policy for our website." />
</svelte:head>

<main class="mx-auto max-w-4xl space-y-8 p-8">
	<h1 class="mb-4 text-3xl font-bold">Privacy Policy</h1>

	<p class="mb-4">Last updated: Mon Jul 15, 2024</p>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">1. Introduction</h2>
		<p>
			Welcome to {companyInfo.name}! This Privacy Policy explains how we collect, use, disclose, and
			safeguard your information when you visit our website.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">2. Information We Collect</h2>
		<p>
			We may collect information about you in a variety of ways. The information we may collect on
			the site includes:
		</p>
		<ul class="list-inside list-disc">
			<li>
				<strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping
				address, email address, and telephone number, and demographic information, such as your age,
				gender, hometown, and interests, that you voluntarily give to us when you register with the site
				or when you choose to participate in various activities related to the site.
			</li>
			<li>
				<strong>Derivative Data:</strong> Information our servers automatically collect when you access
				the site, such as your IP address, your browser type, your operating system, your access times,
				and the pages you have viewed directly before and after accessing the site.
			</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">3. Use of Your Information</h2>
		<p>
			Having accurate information about you permits us to provide you with a smooth, efficient, and
			customized experience. Specifically, we may use information collected about you via the site
			to:
		</p>
		<ul class="list-inside list-disc">
			<li>Reply to your form submissions</li>
			<li>Send you discounts and promotions to your email address.</li>
			<li>
				Generate a personal profile about you to make future visits to the site more personalized.
			</li>
			<li>Increase the efficiency and operation of the site.</li>
			<li>Monitor and analyze usage and trends to improve your experience with the site.</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">4. Disclosure of Your Information</h2>
		<p>
			We may share information we have collected about you in certain situations. Your information
			may be disclosed as follows:
		</p>
		<ul class="list-inside list-disc">
			<li>
				<strong>By Law or to Protect Rights:</strong> If we believe the release of information about
				you is necessary to respond to legal process, to investigate or remedy potential violations of
				our policies, or to protect the rights, property, and safety of others, we may share your information
				as permitted or required by any applicable law, rule, or regulation.
			</li>
			<li>
				<strong>Business Transfers:</strong> We may share or transfer your information in connection
				with, or during negotiations of, any merger, sale of company assets, financing, or acquisition
				of all or a portion of our business to another company.
			</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">5. Security of Your Information</h2>
		<p>
			We use administrative, technical, and physical security measures to help protect your personal
			information. While we have taken reasonable steps to secure the personal information you
			provide to us, please be aware that despite our efforts, no security measures are perfect or
			impenetrable, and no method of data transmission can be guaranteed against any interception or
			other type of misuse.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">6. Policy for Children</h2>
		<p>
			We do not knowingly solicit information from or market to children under the age of 18. If we
			learn that we have collected personal information from a child under age 18 without
			verification of parental consent, we will delete that information as quickly as possible. If
			you believe we might have any information from or about a child under 18, please contact us at
			[Your Contact Information].
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
		<p>
			We may update this Privacy Policy from time to time in order to reflect, for example, changes
			to our practices or for other operational, legal, or regulatory reasons.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">8. Contact Us</h2>
		<p>
			If you have questions or comments about this Privacy Policy, please contact us at <a
				href={`mailto:${companyInfo.email}`}
				class="underline">{companyInfo.email}</a
			>.
		</p>
	</section>
</main>
