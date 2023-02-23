<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { Tag } from "@prisma/client";
	import { clickoutside } from "@svelte-put/clickoutside";
	import { error } from "@sveltejs/kit";
	import { slide } from "svelte/transition";

	export let tags: Tag[];

	export let selectedTags: Tag[] = [];

	let searchTerm = "";
	let searching = false;

	async function addTag() {
		const res = await fetch("/api/tags", {
			method: "POST",
			body: JSON.stringify({ name: searchTerm }),
		});

		if (!res.ok) {
			if (res.status == 401)
				goto("/login?callback=" + $page.url.pathname);
			else {
				throw error(res.status, await res.text());
			}
		} else {
			const newTag: Tag = await res.json();
			tags = [...tags, newTag];
			selectedTags = [...selectedTags, newTag];

			searchTerm = "";
		}
	}
</script>

<div
	use:clickoutside
	on:clickoutside={() => (searching = false)}
	class="mt-4 max-w-[24rem]"
>
	<p class="block">Tags:</p>
	<div class="block">
		{#each tags as tag}
			{#if selectedTags.includes(tag)}
				<button
					class="block opacity-70 ml-0 hover:line-through hover:bg-slate-600 duration-200 p-1 pt-0 pb-0 rounded-lg text-left"
					on:click|preventDefault={() =>
						(selectedTags = selectedTags.filter((x) => x != tag))}
					in:slide|local
					out:slide|local
					type="button"
				>
					#{tag.name}
				</button>
			{/if}
		{/each}
	</div>

	<input
		class="block bg-slate-700 rounded-lg p-1 pl-2 pr-2 w-full mt-1"
		placeholder="Search for tags..."
		type="text"
		bind:value={searchTerm}
		on:click={() => (searching = true)}
	/>

	{#if searching}
		<div
			class="bg-slate-900 p-2 mt-2 rounded-lg drop-shadow-2xl max-h-56 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 scrollbar-thumb-rounded-md"
			out:slide
			in:slide
		>
			{#if selectedTags.length >= 3}
				<p class="opacity-70" in:slide|local out:slide|local>
					Max amount of tags selected
				</p>
			{:else}
				<div in:slide|local out:slide|local>
					{#if searchTerm.length > 0 && !tags.some((x) => x.name == searchTerm)}
						<button
							class="opacity-70 hover:underline block"
							in:slide|local
							out:slide|local
							on:click={addTag}
							type="button"
						>
							Tag not found? Add it!
						</button>
					{/if}

					{#each tags as tag}
						{#if !selectedTags.includes(tag) && tag.name
								.toLowerCase()
								.includes(searchTerm.toLowerCase())}
							<button
								in:slide|local
								out:slide|local
								class="block hover:bg-slate-800 duration-200 p-1 pt-0 pb-0 rounded-lg text-left"
								type="button"
								on:click|preventDefault={() =>
									(selectedTags = [...selectedTags, tag])}
								>{tag.name}</button
							>
						{/if}
					{/each}

					{#if tags.filter((x) => !selectedTags.includes(x) && x.name
								.toLowerCase()
								.includes(searchTerm.toLowerCase())).length == 0}
						{#if searchTerm.length == 0}
							<p
								class="opacity-70"
								in:slide|local
								out:slide|local
							>
								No tags found
							</p>
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
