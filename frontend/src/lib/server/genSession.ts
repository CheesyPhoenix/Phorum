import { randomBytes } from "crypto";
import { Prisma } from "$lib/server/PrismaClient";
import { error, type Cookies, redirect } from "@sveltejs/kit";
const prisma = Prisma.getPrisma();

/**
 * Generates a new session for a user
 * @param userId The id of the user
 * @returns The new session
 */
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

/**
 * Validates a session
 * @param key The session to validate
 * @returns The userId if session is valid, else returns undefined
 */
export async function validateSession(
	key: string
): Promise<number | undefined> {
	const now = new Date();

	const session = await prisma.session.findFirst({
		where: { key: { equals: key }, expire: { gte: now } },
	});

	return session == null ? undefined : session.userId;
}

/**
 * Validates a session, redirects to the login page if session is invalid
 * @param key The session to validate
 * @returns The ``userId`` if session is valid, else redirects to the login page
 */
export async function validateSessionRedirect(cookies: Cookies, url: URL) {
	const key = cookies.get("key");
	if (!key) throw redirect(303, "/login?callback=" + url.pathname);

	const userId = await validateSession(key);
	if (userId == undefined)
		throw redirect(303, "/login?callback=" + url.pathname);

	return userId;
}

/**
 * Validates a session, throws SK error 401 if session is invalid
 * @param key The session to validate
 * @returns The ``userId`` if session is valid, else throws SK error 401
 */
export async function validateSessionError(cookies: Cookies) {
	const key = cookies.get("key");
	if (!key) throw error(401);

	const userId = await validateSession(key);
	if (userId == undefined) throw error(401);

	return userId;
}
