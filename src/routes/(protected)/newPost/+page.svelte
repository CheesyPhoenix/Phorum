<script lang="ts">
	import { goto } from "$app/navigation";
	import AddTags from "$lib/components/AddTags.svelte";
	import BackBtn from "$lib/components/BackBtn.svelte";
	import type { Tag } from "@prisma/client";
	import { fade, fly, scale, slide } from "svelte/transition";
	import type { PageData } from "./$types";

	let title = "";
	let content = "";
	let images: FileList;
	let selectedTags: Tag[];

	export let data: PageData;

	async function submit() {
		let image = "";

		if (images) {
			const fr = new FileReader();

			const img = new Promise<string>((res) => {
				fr.onloadend = () => {
					res(fr.result as string);
				};
			});

			fr.readAsDataURL(images[0]);

			image = await img;
		}

		const res = await fetch("/api/posts", {
			method: "post",
			body: JSON.stringify({
				title,
				content,
				image: images ? image : undefined,
				tags: selectedTags.map((x) => x.id),
			}),
		});

		if (res.status == 200) goto("/");
	}
</script>

<BackBtn />

<main
	class="p-4 bg-slate-800 rounded-xl w-full absolute top-8 left-4"
	in:fly={{ x: 100, opacity: 0 }}
	out:fly={{ x: -100, opacity: 0 }}
>
	<h1 class="font-semibold text-lg ml-2">New Post:</h1>

	<form on:submit|preventDefault={submit} class="p-2  ">
		<label for="title">Title:</label>
		<input
			type="text"
			placeholder="Title..."
			name="title"
			bind:value={title}
		/>
		<label for="content">Message:</label>
		<textarea
			name="content"
			cols="30"
			rows="5"
			placeholder="Message..."
			bind:value={content}
		/>

		<label for="image">Image (opt.)</label>
		<input
			type="file"
			accept="image/jpg, image/jpeg, image/png"
			name="image"
			max="1"
			bind:files={images}
		/>

		{#if images && images[0]}
			<img
				src={images ? URL.createObjectURL(images[0]) : undefined}
				alt="uploaded"
				class="max-w-52 max-h-52"
			/>
		{/if}

		<AddTags tags={data.tags} bind:selectedTags />

		<button
			type="submit"
			disabled={title.length == 0 || content.length == 0}
			class="mt-8 bg-blue-700 rounded-lg p-2 pt-1 pb-1 disabled:opacity-50 disabled:hover:bg-slate-700 disabled:bg-slate-700 hover:bg-blue-500 duration-150"
			>Create new post</button
		>
	</form>
</main>

<style lang="postcss">
	input,
	textarea {
		@apply block bg-slate-700 rounded-lg p-2 max-w-[24rem] w-full;
	}

	label {
		@apply mt-2 block;
	}
</style>
