<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	if ($page.status === 401) {
		goto("/login");
	}
</script>

{#if $page.error}
	<h1>{$page.error.message}</h1>
{/if}
