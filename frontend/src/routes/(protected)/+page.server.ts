import type { PageServerLoad } from "./$types";

import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const load: PageServerLoad = async ({ cookies, url }) => {
	await validateSessionRedirect(cookies, url);

	const posts = await prisma.post.findMany({
		orderBy: { id: "desc" },
		select: { content: true, title: true, id: true },
	});

	return { posts };
};
