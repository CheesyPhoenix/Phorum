<script lang="ts">
	import { goto, invalidate, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import BackBtn from "$lib/components/BackBtn.svelte";
	import { error } from "@sveltejs/kit";
	import type { PageData } from "./$types";

	export let data: PageData;

	async function deletePost(id: number) {
		const res = await fetch("/api/posts/" + id, {
			method: "DELETE",
		});

		if (res.status == 401) goto("/login?callback=" + $page.url.pathname);

		if (!res.ok) throw error(res.status, await res.text());

		await invalidateAll();
	}

	async function deletePosts() {
		const res = await fetch("/api/users/me/posts", {
			method: "DELETE",
		});

		if (res.status == 401) goto("/login?callback=" + $page.url.pathname);

		if (!res.ok) throw error(res.status, await res.text());

		await invalidateAll();
	}

	async function deleteUser() {
		const res = await fetch("/api/users/me/account", {
			method: "DELETE",
		});

		if (res.status == 401) goto("/login?callback=" + $page.url.pathname);

		if (!res.ok) throw error(res.status, await res.text());

		goto("/logout");
	}
</script>

<BackBtn />

<main class="m-2 mt-0 ml-4 max-w-5xl">
	<h2 class="text-xl font-bold mb-3 pt-3 inline-block">
		{data.pageUser.name}
	</h2>
	{#if data.user.id == data.pageUser.id}
		<button
			on:click={deletePosts}
			class="inline-block float-right hover:bg-red-500 duration-150 bg-red-700 w-max p-2 rounded-xl mb-6"
			>Delete All Posts</button
		>
		<button
			on:click={deleteUser}
			class="inline-block float-right mr-2 hover:bg-red-500 duration-150 bg-red-700 w-max p-2 rounded-xl mb-6"
			>Delete Account</button
		>
	{/if}

	{#each data.pageUser.posts as post}
		<div class="max-w-5xl relative">
			<a
				class="bg-slate-700 p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
				href="/post/{post.id}"
			>
				<p class="font-bold">{post.title}</p>
				<p>{post.content}</p>
			</a>

			{#if data.user.id == data.pageUser.id}
				<button
					class="absolute top-1 right-1 hover:bg-slate-600 p-1 rounded-lg duration-200"
					on:click={() => deletePost(post.id)}
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
</main>
