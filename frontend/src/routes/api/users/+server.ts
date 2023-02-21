import { error, type RequestHandler, type Cookies } from "@sveltejs/kit";
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

export const GET: RequestHandler = async ({ cookies }) => {
	await validSession(cookies);

	const users = await prisma.user.findMany({
		orderBy: { id: "desc" },
		select: { id: true, name: true },
	});

	return new Response(JSON.stringify(users));
};
