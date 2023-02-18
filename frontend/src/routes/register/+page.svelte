<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	let username = "";
	let password = "";
	let confirmPassword = "";

	let error: string | undefined = undefined;

	$: {
		if (username.length > 0 && password.length > 0) {
			error = undefined;
		}
	}

	$: {
		if (password !== confirmPassword) {
			error = "Passwords do not match";
		} else if (error == "Passwords do not match") {
			error = undefined;
		}
	}

	async function register() {
		const res = await fetch("/api/register", {
			body: JSON.stringify({ username, password }),
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const data = await res.json();
			error = data;
			username = "";
			password = "";
			confirmPassword = "";
		} else {
			goto($page.url.searchParams.get("callback") ?? "/");
		}
	}
</script>

<form on:submit|preventDefault={register} class="p-2 w-96 m-auto mt-36">
	<h1 class="text-lg font-bold">Register</h1>

	<label for="username">Username:</label>
	<input
		type="text"
		name="username"
		placeholder="Username..."
		bind:value={username}
	/>

	<br />

	<label for="password">Password:</label>
	<input
		type="password"
		name="password"
		placeholder="Password..."
		bind:value={password}
	/>

	<br />
	<label for="password">Confirm password:</label>
	<input
		type="password"
		name="password"
		placeholder="Password..."
		bind:value={confirmPassword}
	/>

	<br />

	{#if error}
		<p class="w-full p-2 rounded-lg mt-4 bg-red-800">{error}</p>
	{/if}

	<button
		type="submit"
		class="mt-6 disabled:bg-slate-600"
		disabled={!(!error && username.length > 0 && password.length > 0)}
		>Register</button
	>

	<a href="/login" class="mt-6 block hover:underline"
		>Already have an account? Log in here...</a
	>
</form>

<style lang="postcss">
	input,
	button {
		@apply bg-slate-400 text-slate-800 p-1 pl-2 pr-2 rounded-xl w-full placeholder-slate-600;
	}

	label {
		@apply mt-2 block mb-0;
	}
</style>
