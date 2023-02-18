import { error, type Cookies } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateSession } from "$lib/server/genSession";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function validSession(cookies: Cookies) {
	const key = cookies.get("key");
	if (!key) throw error(401);

	const userId = await validateSession(key);
	if (userId == undefined) throw error(401);

	return userId;
}

export const GET: RequestHandler = async ({ params, cookies }) => {
	await validSession(cookies);

	let id: number;

	try {
		id = parseInt(params.postID);
	} catch (_) {
		throw error(400, "invalid id");
	}

	const post = await prisma.post.findUnique({
		where: { id: parseInt(params.postID) },
		include: { author: { select: { name: true } } },
	});

	if (post == null) throw error(404);

	return new Response(JSON.stringify(post));
};
