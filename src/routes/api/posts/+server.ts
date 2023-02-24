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
		typeof body.content != "string" ||
		!body.tags ||
		!body.tags.length
	) {
		throw error(400, "Malformed body");
	}

	const data: {
		title: string;
		content: string;
		image?: string;
		tags: number[];
	} = {
		title: body.title,
		content: body.content,
		image: body.image,
		tags: body.tags,
	};

	if (data.tags.length > 3) throw error(400, "Too many tags");

	for (const tag of data.tags) {
		if (!(await prisma.tag.findUnique({ where: { id: tag } }))) {
			throw error(404, "Tag not found");
		}
	}

	await prisma.post.create({
		data: {
			content: data.content,
			title: data.title,
			authorId: userId,
			imageDataURL: data.image,
			tags: {
				connect: data.tags.map((x) => {
					return { id: x };
				}),
			},
		},
	});

	return new Response();
};
