<script lang="ts">
	import BackBtn from "$lib/components/BackBtn.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<BackBtn />

<main class="m-2 mt-0 ml-4 max-w-5xl">
	<h2 class="text-xl font-bold mb-3 pt-3 inline-block">
		{data.tag.name}
	</h2>

	{#each data.tag.posts as post}
		<div class="max-w-5xl relative">
			<a
				class="bg-slate-700 p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
				href="/post/{post.id}"
			>
				<p class="font-bold">{post.title}</p>
				<p>{post.content}</p>
			</a>
		</div>
	{:else}
		<p class="opacity-70">No posts found</p>
	{/each}
</main>
