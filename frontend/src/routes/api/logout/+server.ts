import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete("key");

	return new Response();
};
