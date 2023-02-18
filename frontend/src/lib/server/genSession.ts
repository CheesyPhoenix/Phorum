import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function genNewSession(userId: number): Promise<string> {
	let key = randomBytes(32).toString("hex");

	while (
		(await prisma.session.findFirst({ where: { key: { equals: key } } })) !=
		null
	) {
		key = randomBytes(32).toString("hex");
	}

	const expire = new Date();
	expire.setUTCMinutes(expire.getUTCMinutes() + 10);

	await prisma.session.create({ data: { key, userId, expire } });

	return key;
}

export async function validateSession(
	key: string
): Promise<number | undefined> {
	const now = new Date();

	await prisma.session.deleteMany({ where: { expire: { lt: now } } });

	const session = await prisma.session.findFirst({
		where: { key: { equals: key } },
	});

	return session == null ? undefined : session.userId;
}
