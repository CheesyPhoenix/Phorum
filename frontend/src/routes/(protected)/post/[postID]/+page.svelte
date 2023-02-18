<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main class="p-4 m-2 mt-4 bg-slate-800 rounded-xl max-w-5xl">
	<h3 class="font-bold">
		{data.post.title}
		<span class="opacity-50 font-normal"> - {data.post.author.name}</span>
	</h3>

	<p>{data.post.content}</p>

	{#if data.post.imageDataURL}
		<img
			src={data.post.imageDataURL}
			alt={data.post.title}
			class="mt-4 max-w-52 max-h-52 hover:max-h-96 hover:max-w-96 duration-300"
		/>
	{/if}
</main>
