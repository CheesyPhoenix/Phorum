import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const load: LayoutServerLoad = async ({ url, cookies }) => {
	const userId = await validateSessionRedirect(cookies, url);

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { name: true, id: true },
	});

	if (user == null) throw redirect(303, "/login?callback=" + url.pathname);

	return { user };
};
