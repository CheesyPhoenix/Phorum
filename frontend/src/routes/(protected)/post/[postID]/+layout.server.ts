import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";

const prisma = Prisma.getPrisma();

export const load: LayoutServerLoad = async ({ params, cookies, url }) => {
	await validateSessionRedirect(cookies, url);

	let id: number;

	try {
		id = parseInt(params.postID);
		if (isNaN(id)) throw error(400, "invalid id");
	} catch (_) {
		throw error(400, "invalid id");
	}

	const post = await prisma.post.findUnique({
		where: { id },
		include: { author: { select: { name: true } }, tags: true },
	});

	if (post == null) throw error(404);

	return { post };
};
