import type { Post } from "@prisma/client";
import type { LayoutLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ params, fetch }) => {
	const res = await fetch("/api/posts/" + params.postID);

	if (!res.ok) {
		throw error(res.status, await res.text());
	}

	const post: Post & {
		author: {
			name: string;
		};
	} = await res.json();
	return { post };
};
