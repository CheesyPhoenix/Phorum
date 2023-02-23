import type { PageServerLoad } from "./$types";
import { validateSessionRedirect } from "$lib/server/genSession";
import { Prisma } from "$lib/server/PrismaClient";
import { error } from "@sveltejs/kit";

const prisma = Prisma.getPrisma();

export const load: PageServerLoad = async ({ cookies, url, params }) => {
	await validateSessionRedirect(cookies, url);

	let id: number;

	try {
		id = parseInt(params.tagID);
		if (isNaN(id)) throw error(400, "invalid id");
	} catch (_) {
		throw error(400, "invalid id");
	}

	const tag = await prisma.tag.findUnique({
		where: { id },
		select: {
			name: true,
			id: true,
			posts: {
				select: {
					id: true,
					content: true,
					title: true,
				},
			},
		},
	});

	if (tag === null) {
		throw error(404, "User not found");
	}

	return { tag };
};
