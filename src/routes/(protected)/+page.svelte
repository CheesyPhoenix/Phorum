<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main class="p-4 pt-0 absolute top-0 w-full" in:fade out:fade>
	<a
		href="/newPost"
		class="hover:bg-blue-500 duration-150 block bg-blue-700 w-max p-2 rounded-xl mb-4"
		in:fly={{ x: 100, opacity: 0 }}
		out:fly={{ x: -100, opacity: 0 }}>Make a new post</a
	>

	{#each data.posts as post, i}
		<a
			class="bg-slate-700 max-w-5xl p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
			href="/post/{post.id}"
			in:fly={{ x: 100, opacity: 0, delay: 50 * i }}
			out:fly={{ x: -100, opacity: 0, delay: 50 * i }}
		>
			<p class="font-bold">{post.title}</p>
			<p>{post.content}</p>
		</a>
	{/each}
</main>
