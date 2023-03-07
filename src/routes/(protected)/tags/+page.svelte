<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main class="p-4 pt-0 absolute top-0 w-full" in:fade out:fade>
	<h2
		class="text-lg font-bold mb-4"
		in:fly={{ x: 100, opacity: 0 }}
		out:fly={{ x: -100, opacity: 0 }}
	>
		Tags
	</h2>
	{#each data.tags as tag, i}
		<a
			class="bg-slate-700 max-w-5xl p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
			href="/tags/{tag.id}"
			in:fly={{ x: 100, opacity: 0, delay: 50 * i }}
			out:fly={{ x: -100, opacity: 0, delay: 50 * i }}
		>
			<p class="font-bold inline">{tag.name}</p>
			<p class="inline float-right opacity-70">
				{tag.posts.length} posts
			</p>
		</a>
	{/each}
</main>
