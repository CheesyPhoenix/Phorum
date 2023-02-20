import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch("/api/users");

	if (!res.ok) {
		throw error(res.status, await res.text());
	}

	const users: {
		id: number;
		name: string;
	}[] = await res.json();

	return { users };
};
