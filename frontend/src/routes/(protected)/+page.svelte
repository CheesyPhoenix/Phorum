<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main class="p-4 pt-0">
	<a
		href="/newPost"
		class="hover:bg-blue-500 duration-150 block bg-blue-700 w-max p-2 rounded-xl mb-4"
		>Make a new post</a
	>

	{#each data.posts as post}
		<a
			class="bg-slate-700 max-w-5xl p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
			href="/post/{post.id}"
		>
			<p class="font-bold">{post.title}</p>
			<p>{post.content}</p>
		</a>
	{/each}
</main>
