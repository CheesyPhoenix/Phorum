import type { PageServerLoad } from "./$types";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const load: PageServerLoad = async ({ cookies, url }) => {
	await validateSessionRedirect(cookies, url);

	const users = await prisma.user.findMany({
		orderBy: { id: "desc" },
		select: { id: true, name: true, posts: { select: { _count: true } } },
	});

	return { users };
};
