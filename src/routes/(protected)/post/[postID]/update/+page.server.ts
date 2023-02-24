import type { PageServerLoad } from "./$types";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const load: PageServerLoad = async ({ cookies, url, params }) => {
	await validateSessionRedirect(cookies, url);

	const tags = await prisma.tag.findMany();

	return { tags };
};
