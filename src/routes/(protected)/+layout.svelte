<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import { fade, fly, slide } from "svelte/transition";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;
</script>

<div in:fade out:fade class="">
	<Header username={data.user.name} userID={data.user.id} />

	<div class="relative max-w-5xl ml-4 mr-4">
		<slot />
	</div>
</div>
