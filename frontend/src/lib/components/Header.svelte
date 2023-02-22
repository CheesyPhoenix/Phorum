<script lang="ts">
	import { scale, slide } from "svelte/transition";
	import { clickoutside } from "@svelte-put/clickoutside";
	import { navigating } from "$app/stores";

	export let username: string;
	export let userID: number;

	let menuOpen = false;

	$: {
		if ($navigating) menuOpen = false;
	}
</script>

<header
	class=" bg-slate-800 hover:bg-slate-600 duration-200 h-12 mb-4 m-2 rounded-xl"
>
	<div class="h-full flex justify-center flex-col">
		<div>
			<a class="text-2xl ml-2 h-9 inline-block" href="/">Phorum</a>

			<button
				class="inline-block float-right mr-2 mt-0.5 relative"
				on:mousedown|stopPropagation
				on:click={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1"
						stroke="#cccccc"
						class="w-8 h-8 absolute right-0 top-0"
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
						stroke-width="1"
						stroke="#ffffff"
						class="w-8 h-8 absolute right-0 top-0"
						in:scale
						out:scale
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>
</header>

{#if menuOpen}
	<div
		class="absolute right-2 top-16 bg-slate-800 w-48 h-max rounded-xl drop-shadow-xl p-2 pl-4 pr-4 z-10"
		in:slide
		out:slide
		use:clickoutside={{ event: "mousedown" }}
		on:clickoutside={() => (menuOpen = false)}
	>
		<p class="opacity-70">{username}</p>

		<hr class="opacity-30 mb-2" />

		<a
			href="/users/{userID}"
			class="hover:bg-slate-700 w-full block rounded-md pl-2 pr-2 duration-200 mb-1"
			>Account</a
		>

		<a
			href="/users"
			class="hover:bg-slate-700 w-full block rounded-md pl-2 pr-2 duration-200 mb-1"
			>Users</a
		>

		<a
			href="/logout"
			class="hover:bg-slate-700 w-full block rounded-md pl-2 pr-2 duration-200 mb-1"
			>Logout</a
		>
	</div>
{/if}
