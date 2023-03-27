<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation";
	import BackBtn from "$lib/components/BackBtn.svelte";
	import { error } from "@sveltejs/kit";
	import { comment } from "postcss";
	import { fly, scale, slide } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;

	async function deletePost() {
		const res = await fetch("/api/posts/" + data.post.id, {
			method: "DELETE",
		});

		if (!res.ok) throw error(res.status, await res.text());

		goto("/");
	}

	//comments
	let newCommentMessage = "";

	async function addComment() {
		const res = await fetch(`/api/posts/${data.post.id}/comments`, {
			method: "POST",
			body: JSON.stringify({ message: newCommentMessage }),
		});

		if (!res.ok) throw error(res.status, await res.text());

		invalidateAll();

		newCommentMessage = "";
	}

	async function deleteComment(commentId: number) {
		const res = await fetch(`/api/comments/${commentId}`, {
			method: "DELETE",
		});

		if (!res.ok) throw error(res.status, await res.text());

		invalidateAll();
	}

	let editingCommentID: number | undefined = undefined;
	let editingCommentMessage: string | undefined = undefined;

	async function editComment() {
		const res = await fetch(`/api/comments/${editingCommentID}`, {
			method: "PATCH",
			body: JSON.stringify({ message: editingCommentMessage }),
		});

		if (!res.ok) throw error(res.status, await res.text());

		await invalidateAll();

		editingCommentID = undefined;
		editingCommentMessage = undefined;
	}
</script>

<BackBtn href="/" />

<main
	class="w-full absolute top-8 left-0 overflow-x-hidden"
	in:fly={{ x: 100, opacity: 0 }}
	out:fly={{ x: -100, opacity: 0 }}
>
	<div class="bg-slate-800 p-4 rounded-xl mb-4">
		<h3 class="font-bold {data.post.authorId == data.user.id ? "mr-20" : ""}">
			{data.post.title}
			<span class="opacity-50 font-normal">
				- {data.post.author.name}</span
			>
			<span class="float-right opacity-50 font-normal"
				>{data.post.updatedAt?.toLocaleString("en", {
					hour12: false,
					hourCycle: "h24",
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}) ??
					data.post.createdAt.toLocaleString("en", {
						hour12: false,
						hourCycle: "h24",
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					})}</span
			>
		</h3>

		<p>{data.post.content}</p>

		{#if data.post.imageDataURL}
			<img
				src={data.post.imageDataURL}
				alt={data.post.title}
				class="mt-4 max-w-52 max-h-52 hover:max-h-96 hover:max-w-96 duration-300"
			/>
		{/if}

		{#if data.post.tags.length > 0}
			<br />

			{#each data.post.tags as tag}
				<a
					class="opacity-70 hover:underline block w-max"
					href="/tags/{tag.id}">#{tag.name}</a
				>
			{/each}
		{/if}

		<!-- Buttons -->
		{#if data.post.authorId === data.user.id}
			<a
				href="/post/{data.post.id}/update"
				class="absolute top-2 right-12 hover:bg-slate-600 p-1 rounded-lg duration-200 hover:drop-shadow-md"
			>
				<svg
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
						d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
					/>
				</svg>
			</a>

			<button
				class="absolute top-2 right-2 hover:bg-slate-600 p-1 rounded-lg duration-200 hover:drop-shadow-md"
				on:click={deletePost}
			>
				<svg
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
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
					/>
				</svg>
			</button>
		{/if}
	</div>

	<h2 class="mb-2">Comments</h2>

	<div class="p-4 rounded-xl bg-slate-800">
		<p class="mb-1">Write your comment here:</p>
		<form on:submit|preventDefault={addComment}>
			<input
				type="text"
				placeholder="Your comment..."
				bind:value={newCommentMessage}
			/>
		</form>
	</div>

	<div class="mb-8 flex flex-col-reverse">
		{#each data.post.comments as comment (comment.id)}
			<div
				class="bg-slate-800 rounded-xl p-4 mt-2 relative"
				in:slide
				out:slide
			>
				<b class="font-bold"
					>{comment.author.name}
					<span class="opacity-50 font-normal">
						-
						{comment.updatedAt?.toLocaleString("en", {
							hour12: false,
							hourCycle: "h24",
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
						}) ??
							comment.createdAt.toLocaleString("en", {
								hour12: false,
								hourCycle: "h24",
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
							})}
					</span></b
				>

				{#if editingCommentID == comment.id}
					<form
						on:submit|preventDefault={editComment}
						in:slide|local
						out:slide|local
					>
						<input
							type="text"
							placeholder="Your comment..."
							bind:value={editingCommentMessage}
						/>
					</form>
				{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<p
						in:slide|local
						out:slide|local
						on:click={() => {
							if (comment.authorId == data.user.id) {
								editingCommentID = comment.id;
								editingCommentMessage = comment.message;
							}
						}}
					>
						{comment.message}
					</p>
				{/if}

				{#if comment.authorId == data.user.id}
					<button
						class="hover:bg-slate-600 p-1 rounded-lg duration-200 hover:drop-shadow-md block absolute top-2 right-11"
						on:click={() => {
							editingCommentMessage =
								comment.id == editingCommentID
									? undefined
									: comment.message;
							editingCommentID =
								comment.id == editingCommentID
									? undefined
									: comment.id;
						}}
					>
						<div class="relative w-6 h-6">
							{#if editingCommentID == comment.id}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1"
									stroke="#ffffff"
									class="w-8 h-8 absolute top-[-0.250rem] left-[-0.250rem]"
									in:scale
									out:scale
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 absolute top-0"
									in:scale
									out:scale
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
									/>
								</svg>
							{/if}
						</div>
					</button>

					<button
						class="hover:bg-slate-600 p-1 rounded-lg duration-200 hover:drop-shadow-md block absolute top-2 right-2"
						on:click={() => deleteComment(comment.id)}
					>
						<svg
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
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
					</button>
				{/if}
			</div>
		{/each}
	</div>
</main>

<style lang="postcss">
	input {
		@apply block bg-slate-700 rounded-lg p-2 max-w-[24rem] w-full;
	}
</style>
