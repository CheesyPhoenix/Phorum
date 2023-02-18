import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	await fetch("/api/logout");
	throw redirect(303, "/login");
};
