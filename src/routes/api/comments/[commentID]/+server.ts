//@ts-ignore
import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const DELETE: RequestHandler = async ({ params, cookies, url }) => {
	const userID = await validateSessionRedirect(cookies, url);

	let commentId: number;

	try {
		commentId = parseInt(params.commentID);
	} catch (_) {
		throw error(400, "invalid comment id");
	}

	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
	});

	if (comment == null) throw error(404);
	if (comment.authorId != userID) throw error(401);

	await prisma.comment.delete({ where: { id: comment.id } });

	return new Response();
};

export const PATCH: RequestHandler = async ({
	params,
	cookies,
	url,
	request,
}) => {
	const userID = await validateSessionRedirect(cookies, url);

	let commentId: number;
	try {
		commentId = parseInt(params.commentID);
	} catch (_) {
		throw error(400, "invalid comment id");
	}

	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
	});
	if (comment == null) throw error(404);
	if (comment.authorId != userID) throw error(401);

	const data = await request.json();
	if (!data || data.message == undefined) {
		throw error(400);
	}

	await prisma.comment.update({
		data: { message: data.message },
		where: { id: comment.id },
	});

	return new Response();
};
