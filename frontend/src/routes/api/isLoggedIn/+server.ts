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
	const userId = await validSession(cookies);

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { name: true },
	});

	if (user == null) throw error(401);

	return new Response(JSON.stringify(user));
};
