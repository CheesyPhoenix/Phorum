import { validateSessionError } from "$lib/server/genSession";
import type { RequestHandler } from "./$types";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const DELETE: RequestHandler = async ({ cookies }) => {
	const userID = await validateSessionError(cookies);

	await prisma.post.deleteMany({ where: { authorId: userID } });

	return new Response();
};
