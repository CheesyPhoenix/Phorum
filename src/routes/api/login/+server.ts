import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Prisma } from "$lib/server/PrismaClient";
import bcrypt from "bcrypt";
import { genNewSession } from "$lib/server/genSession";

const prisma = Prisma.getPrisma();

export const POST: RequestHandler = async ({ cookies, request }) => {
	const body = await request.json();

	if (!body.username || !body.password) {
		throw error(400, "malformed body");
	}
	const data: { username: string; password: string } = {
		username: body.username,
		password: body.password,
	};

	const user = await prisma.user.findFirst({
		where: { name: { equals: data.username } },
	});

	if (user == null || !bcrypt.compareSync(data.password, user.passHash))
		throw error(400, "Username or password is incorrect!");

	const session = await genNewSession(user.id);

	cookies.set("key", session, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
	});

	return new Response();
};
