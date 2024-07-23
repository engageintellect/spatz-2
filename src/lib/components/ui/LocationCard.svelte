<script lang="ts">
	import { MapLibre, DefaultMarker, Popup } from 'svelte-maplibre';

	export let center: [number, number];
	export let name: string;

	// Define the MarkerProps type
	type MarkerProps = {
		lngLat: [number, number];
		name: string;
	};

	const mapClasses = 'map';
	const markers: MarkerProps[] = [{ lngLat: center, name: name }];

	function openInGoogleMaps(address: string) {
		const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
		window.open(url, '_blank');
	}
</script>

<div class="z-0">
	<MapLibre
		style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		class={`${mapClasses} h-48 cursor-pointer rounded-lg border md:h-64`}
		zoom={14}
		interactive={false}
		{center}
	>
		{#each markers as { lngLat, name }}
			<DefaultMarker {lngLat} class="">
				<Popup offset={[0, -10]}>
					<button on:click={() => openInGoogleMaps(name)}>
						{name}
					</button>
				</Popup>
			</DefaultMarker>
		{/each}
	</MapLibre>
</div>
