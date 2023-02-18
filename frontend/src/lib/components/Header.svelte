<script lang="ts">
	export let username: string;
</script>

<header
	class=" bg-slate-800 hover:bg-slate-600 duration-200 h-12 mb-4 m-2 rounded-xl"
>
	<div class="h-full flex justify-center flex-col">
		<div>
			<a class="text-2xl ml-2 h-9 inline-block" href="/">Phorum</a>

			<div class="inline-block float-right mr-4 mt-1">
				<p class="inline">{username}</p>
				<a href="/logout">| Log out</a>
			</div>
		</div>
	</div>
</header>
