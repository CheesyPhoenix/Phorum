<script lang="ts">
	import type { Tag } from "@prisma/client";
	import { clickoutside } from "@svelte-put/clickoutside";

	export let tags: Tag[];

	let selectedTags: Tag[] = [];

	let searchTerm = "";
	let searching = false;
</script>

<div use:clickoutside on:clickoutside={() => (searching = false)} class="mt-4">
	{#each selectedTags as tag, i}
		<button
			class="inline"
			on:click|preventDefault={() =>
				(selectedTags = selectedTags.filter((x) => x != tag))}
		>
			#{tag.name}{selectedTags.length - 1 > i ? ", " : ""}
		</button>
	{/each}

	<input
		class="block"
		type="text"
		bind:value={searchTerm}
		on:click={() => (searching = true)}
	/>

	{#if searching}
		<div>
			{#each tags as tag}
				{#if !selectedTags.includes(tag) && tag.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase())}
					<button
						class="block"
						type="button"
						on:click|preventDefault={() =>
							(selectedTags = [...selectedTags, tag])}
						>{tag.name}</button
					>
				{/if}
			{/each}
		</div>
	{/if}
</div>
