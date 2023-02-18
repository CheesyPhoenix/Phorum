import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url }) => {
	const res = await fetch("/api/isLoggedIn");

	if (res.status == 401)
		throw redirect(303, "/login?callback=" + url.pathname);

	const user: {
		name: string;
	} = await res.json();

	return { user };
};
