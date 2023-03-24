import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const POST: RequestHandler = async ({
	params,
	cookies,
	url,
	request,
}) => {
	const userID = await validateSessionRedirect(cookies, url);

	let data = await request.json();
	if (!data || data.message == undefined) {
		throw error(400);
	}

	const post = await prisma.post.findUnique({
		where: { id: parseInt(params.postID) },
		select: { id: true },
	});

	if (post == null) throw error(404);

	await prisma.comment.create({
		data: {
			post: { connect: { id: post.id } },
			message: data.message,
			author: { connect: { id: userID } },
		},
	});

	return new Response();
};
