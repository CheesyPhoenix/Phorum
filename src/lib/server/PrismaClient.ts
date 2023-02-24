import { PrismaClient } from "@prisma/client";

export class Prisma {
	public static Prisma: PrismaClient;

	static getPrisma() {
		if (this.Prisma === null || !this.Prisma)
			this.Prisma = new PrismaClient();

		return this.Prisma;
	}
}
