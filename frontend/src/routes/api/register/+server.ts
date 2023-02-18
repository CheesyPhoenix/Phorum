import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { genNewSession } from "$lib/server/genSession";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ cookies, request }) => {
	const body = await request.json();

	if (!body.username || !body.password) {
		throw error(400, "malformed body");
	}
	const data: { username: string; password: string } = {
		username: body.username,
		password: body.password,
	};

	if (
		(await prisma.user.findFirst({
			where: { name: { equals: data.username } },
		})) != null
	) {
		throw error(409, "Username taken");
	}

	const passHash = bcrypt.hashSync(data.password, 10);

	const newUser = await prisma.user.create({
		data: { name: data.username, passHash },
	});

	const session = await genNewSession(newUser.id);

	cookies.set("key", session, { httpOnly: true, sameSite: "lax" });

	return new Response();
};
