<script lang="ts">
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
		const res = await fetch("http://localhost:8080/register", {
			body: JSON.stringify({ username, password }),
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();

		if (!res.ok) {
			error = data;
			username = "";
			password = "";
			confirmPassword = "";
		} else {
			window.open("/");
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
