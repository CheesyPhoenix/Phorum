<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { scale, slide } from "svelte/transition";

	let username = "";
	let password = "";

	let error: string | undefined = undefined;

	$: {
		if (username.length > 0 && password.length > 0) {
			error = undefined;
		}
	}

	async function login() {
		const res = await fetch("/api/login", {
			body: JSON.stringify({ username, password }),
			method: "post",
		});

		console.log(res.status);

		if (!res.ok) {
			const data = await res.json();
			console.log(data);

			error = data.message;
			username = "";
			password = "";
		} else {
			goto($page.url.searchParams.get("callback") ?? "/");
		}
	}
</script>

<div class="absolute top-0 left-0 w-screen h-screen">
	<form
		on:submit|preventDefault={login}
		class="p-2 w-96 m-auto mt-36"
		in:scale
		out:scale
	>
		<h1 class="text-lg font-bold">Login</h1>

		<label for="username">Username:</label>
		<br />
		<input
			type="text"
			name="username"
			placeholder="Username..."
			bind:value={username}
		/>

		<br />

		<label for="password">Password:</label>
		<br />
		<input
			type="password"
			name="password"
			placeholder="Password..."
			bind:value={password}
		/>

		<br />

		{#if error}
			<p class="w-full p-2 rounded-lg mt-4 bg-red-800">{error}</p>
		{/if}

		<button
			type="submit"
			class="mt-6 disabled:bg-slate-600"
			disabled={!(!error && username.length > 0 && password.length > 0)}
			>Login</button
		>

		<a
			href="/register?callback={$page.url.searchParams.get('callback') ??
				'/'}"
			class="mt-6 block hover:underline"
			>Don't have an account? Sign up here...</a
		>
	</form>
</div>

<style lang="postcss">
	input,
	button {
		@apply bg-slate-400 text-slate-800 p-1 pl-2 pr-2 rounded-xl w-full placeholder-slate-600;
	}
</style>
