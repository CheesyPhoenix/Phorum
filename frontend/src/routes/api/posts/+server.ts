import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const POST: RequestHandler = async ({ cookies, request, url }) => {
	const userId = await validateSessionRedirect(cookies, url);

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
