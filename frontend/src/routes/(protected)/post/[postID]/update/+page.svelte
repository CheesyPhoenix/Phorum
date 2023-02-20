<script lang="ts">
	import { goto } from "$app/navigation";
	import { error } from "@sveltejs/kit";
	import type { PageData } from "./$types";

	export let data: PageData;

	let title = data.post.title;
	let content = data.post.content;
	let images: FileList;

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

		const res = await fetch("/api/posts/" + data.post.id, {
			method: "PATCH",
			body: JSON.stringify({
				title,
				content,
				image: images ? image : data.post.imageDataURL,
			}),
		});

		if (!res.ok) throw error(res.status, await res.text());

		if (res.status == 200) goto("/");
	}
</script>

<a class="ml-4 mb-4 block" href="./"
	><svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
		/>
	</svg>
</a>

<main class="p-4 m-2 mt-4 bg-slate-800 rounded-xl max-w-5xl">
	<h1 class="font-semibold text-lg ml-2">Edit Post:</h1>

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

		{#if images || data.post.imageDataURL}
			<img
				src={images
					? URL.createObjectURL(images[0])
					: data.post.imageDataURL}
				alt="uploaded"
				class="max-w-52 max-h-52 mt-2"
			/>
		{/if}

		<button
			type="submit"
			disabled={title.length == 0 || content.length == 0}
			class="mt-8 bg-blue-700 rounded-lg p-2 pt-1 pb-1 disabled:opacity-50 disabled:bg-slate-700 hover:bg-blue-500 duration-150"
			>Update post</button
		>
	</form>
</main>

<style lang="postcss">
	input,
	textarea {
		@apply block bg-slate-700 rounded-lg p-2;
	}

	label {
		@apply mt-2 block;
	}
</style>
