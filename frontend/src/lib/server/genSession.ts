import { randomBytes } from "crypto";
import { Prisma } from "$lib/server/PrismaClient";
import { error, type Cookies, redirect } from "@sveltejs/kit";
const prisma = Prisma.getPrisma();

export async function genNewSession(userId: number): Promise<string> {
	console.log("new session");

	const now = new Date();

	await prisma.session.deleteMany({ where: { expire: { lt: now } } });

	let key = randomBytes(32).toString("hex");

	while (
		(await prisma.session.findFirst({ where: { key: { equals: key } } })) !=
		null
	) {
		console.log("key taken");

		key = randomBytes(32).toString("hex");
	}

	const expire = new Date();
	expire.setUTCMinutes(expire.getUTCMinutes() + 30);

	await prisma.session.create({ data: { key, userId, expire } });

	console.log("new session created");

	return key;
}

export async function validateSession(
	key: string
): Promise<number | undefined> {
	const now = new Date();

	const session = await prisma.session.findFirst({
		where: { key: { equals: key }, expire: { gte: now } },
	});

	return session == null ? undefined : session.userId;
}

export async function validateSessionRedirect(cookies: Cookies, url: URL) {
	const key = cookies.get("key");
	if (!key) throw redirect(303, "/login?callback=" + url.pathname);

	const userId = await validateSession(key);
	if (userId == undefined)
		throw redirect(303, "/login?callback=" + url.pathname);

	return userId;
}
