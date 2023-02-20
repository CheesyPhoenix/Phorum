import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Post } from "@prisma/client";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch("/api/posts");

	if (!res.ok) {
		throw error(res.status, await res.text());
	}

	const posts: Post[] = await res.json();

	return { posts };
};
