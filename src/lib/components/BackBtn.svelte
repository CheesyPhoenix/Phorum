<script lang="ts">
	import { fly } from "svelte/transition";

	export let href = "./";
</script>

<a
	class="ml-2 mb-4 block w-min absolute top-0"
	{href}
	in:fly={{ x: 100, opacity: 0 }}
	out:fly={{ x: -100, opacity: 0 }}
	><svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
		/>
	</svg>
</a>
