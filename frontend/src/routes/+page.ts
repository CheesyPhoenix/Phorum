import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const posts = await fetch("http://127.0.0.1:8080/posts");

	if (!posts.ok) throw redirect(303, "/login");
};
