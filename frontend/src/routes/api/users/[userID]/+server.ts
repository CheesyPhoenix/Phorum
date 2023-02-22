import { validateSessionError } from "$lib/server/genSession";
import type { RequestHandler } from "./$types";
import { Prisma } from "$lib/server/PrismaClient";
import { error } from "@sveltejs/kit";

const prisma = Prisma.getPrisma();

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const userID = await validateSessionError(cookies);

	let id: number;

	try {
		id = parseInt(params.userID);
	} catch (_) {
		throw error(400, "invalid id");
	}

	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (user == null) throw error(404);
	if (user.id != userID) throw error(401);

	await prisma.user.delete({ where: { id } });

	return new Response();
};
