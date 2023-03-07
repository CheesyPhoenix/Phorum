<script lang="ts">
	import BackBtn from "$lib/components/BackBtn.svelte";
	import { fade, fly } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<BackBtn />

<main class="p-4 absolute top-6 pt-0 w-full" in:fade out:fade>
	<h2
		class="text-xl font-bold mb-3 pt-3 inline-block"
		in:fly={{ x: 100, opacity: 0 }}
		out:fly={{ x: -100, opacity: 0 }}
	>
		{data.tag.name}
	</h2>

	{#each data.tag.posts as post, i}
		<div class="max-w-5xl relative">
			<a
				class="bg-slate-700 p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
				href="/post/{post.id}"
				in:fly={{ x: 100, opacity: 0, delay: 50 * i }}
				out:fly={{ x: -100, opacity: 0, delay: 50 * i }}
			>
				<p class="font-bold">{post.title}</p>
				<p>{post.content}</p>
			</a>
		</div>
	{/each}

	{#if data.tag.posts.length == 0}
		<p
			class="opacity-70 block w-max"
			in:fly={{ x: 100, opacity: 0 }}
			out:fly={{ x: -100, opacity: 0 }}
		>
			No posts found
		</p>
	{/if}
</main>
