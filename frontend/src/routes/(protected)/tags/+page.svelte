<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h2 class="text-lg font-bold ml-4">Tags</h2>

<main class="p-4">
	{#each data.tags as tag}
		<a
			class="bg-slate-700 max-w-5xl p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
			href="/tags/{tag.id}"
		>
			<p class="font-bold inline">{tag.name}</p>
			<p class="inline float-right opacity-70">
				{tag.posts.length} posts
			</p>
		</a>
	{/each}
</main>
