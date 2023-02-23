<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h2 class="text-lg font-bold ml-4">Users</h2>

<main class="p-4">
	{#each data.users as user}
		<a
			class="bg-slate-700 max-w-5xl p-4 mb-2 rounded-lg block hover:bg-slate-600 duration-200"
			href="/users/{user.id}"
		>
			<p class="font-bold">{user.name}</p>
		</a>
	{/each}
</main>
