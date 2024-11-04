<script lang="ts">
	export let data;

	import { currentUser } from '$lib/stores/user';
</script>

<div class="">
	<div>
		subscription: {$currentUser.subscribed}
	</div>

	<div>
		prediction accuary: {data.predictions.predictionAccuracy}
	</div>
</div>
