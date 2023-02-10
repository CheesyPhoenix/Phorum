import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const user = await prisma.user.create({
	data: {
		name: "Bob kåre4",
		posts: {
			create: {
				title: "A post",
				content: "The first one",
			},
		},
	},
});

console.log(user);

const users = await prisma.user.findMany({ include: { posts: true } });

const post = await prisma.post.create({
	data: {
		title: "Another post",
		content: "The second one",
		authorId: users[0].id,
	},
});

console.dir(users, { depth: null });

await prisma.$disconnect();
