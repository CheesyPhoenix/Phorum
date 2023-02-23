import { error, type Cookies } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateSession } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

async function validSession(cookies: Cookies) {
	const key = cookies.get("key");
	if (!key) throw error(401);

	const userId = await validateSession(key);
	if (userId == undefined) throw error(401);

	return userId;
}

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const userID = await validSession(cookies);

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
	if (post.authorId != userID) throw error(401);

	await prisma.post.delete({ where: { id } });

	return new Response();
};

export const PATCH: RequestHandler = async ({ cookies, request, params }) => {
	await validSession(cookies);
	let id: number;

	try {
		id = parseInt(params.postID);
	} catch (_) {
		throw error(400, "invalid id");
	}

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

	await prisma.post.update({
		data: {
			content: data.content,
			title: data.title,
			imageDataURL: data.image,
			tags: {
				set: data.tags.map((x) => {
					return { id: x };
				}),
			},
		},
		where: { id },
	});

	return new Response();
};
