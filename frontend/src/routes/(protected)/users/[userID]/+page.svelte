<script lang="ts">
	import BackBtn from "$lib/components/BackBtn.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<BackBtn />

<main class="p-2">
	<h1>{data.user.name}</h1>

	{#each data.user.posts as post}
		<a
			class="bg-slate-700 max-w-5xl p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
			href="/post/{post.id}"
		>
			<p class="font-bold">{post.title}</p>
			<p>{post.content}</p>
		</a>
	{/each}
</main>
