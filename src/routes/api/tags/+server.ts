import { validateSessionError } from "$lib/server/genSession";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const POST: RequestHandler = async ({ cookies, request }) => {
	await validateSessionError(cookies);

	const body = await request.json();
	if (!body.name || typeof body.name != "string") {
		throw error(400, "Malformed body");
	}

	const data: { name: string } = {
		name: body.name,
	};

	const tag = await prisma.tag.create({ data: { name: data.name } });

	return new Response(JSON.stringify(tag));
};
