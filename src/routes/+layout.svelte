<script lang="ts">
	import "../app.css";
	import { navigating } from "$app/stores";
	import { Shadow } from "svelte-loading-spinners";
	import { fade, scale } from "svelte/transition";

	let isLoading = false;
	let showLoader = false;

	$: {
		if ($navigating) {
			if (!isLoading) {
				isLoading = true;
				setTimeout(() => {
					if (isLoading) showLoader = true;
				}, 400);
			}
		} else {
			isLoading = false;
			showLoader = false;
		}
	}
</script>

<slot />

{#if showLoader}
	<div
		in:fade
		out:fade
		class="absolute w-screen m-0 flex justify-center bg-black bg-opacity-30 h-screen top-0 left-0 z-20"
	>
		<div in:scale out:scale class="h-screen flex flex-col justify-center">
			<Shadow color={"#1d4ed8"} />
		</div>
	</div>
{/if}
