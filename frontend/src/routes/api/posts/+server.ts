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

export const GET: RequestHandler = async ({ cookies }) => {
	await validSession(cookies);

	const posts = await prisma.post.findMany({
		orderBy: { id: "desc" },
	});

	return new Response(JSON.stringify(posts));
};

export const POST: RequestHandler = async ({ cookies, request }) => {
	const userId = await validSession(cookies);

	const body = await request.json();
	if (
		!body.title ||
		typeof body.title != "string" ||
		!body.content ||
		typeof body.content != "string"
	) {
		throw error(400, "Malformed body");
	}

	const data: { title: string; content: string; image?: string } = {
		title: body.title,
		content: body.content,
		image: body.image,
	};

	await prisma.post.create({
		data: {
			content: data.content,
			title: data.title,
			authorId: userId,
			imageDataURL: data.image,
		},
	});

	return new Response();
};
