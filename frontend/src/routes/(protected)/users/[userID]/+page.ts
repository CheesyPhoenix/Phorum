import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
	const res = await fetch("/api/users/" + params.userID);
	if (!res.ok) throw error(res.status, await res.text());
};
