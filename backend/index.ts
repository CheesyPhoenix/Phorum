import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { genNewSession, validateSession } from "./genSession";

const app = express();
app.use(cookieParser());
app.use(cors());

const prisma = new PrismaClient();

const PORT = 8080;

app.post("/register", async (req, res) => {
	const body = JSON.parse(req.body);
	if (!body.username || !body.password) {
		res.status(400).send("malformed body");
		return;
	}
	const data: { username: string; password: string } = {
		username: body.username,
		password: body.password,
	};

	const passHash = bcrypt.hashSync(data.password, 10);

	const newUser = await prisma.user.create({
		data: { name: data.username, passHash },
	});

	const session = await genNewSession(newUser.id);

	res.cookie("key", session, { httpOnly: true, sameSite: true })
		.status(200)
		.send();
});
app.post("/login", async (req, res) => {
	const body = JSON.parse(req.body);
	if (!body.username || !body.password) {
		res.status(400).send("malformed body");
		return;
	}
	const data: { username: string; password: string } = {
		username: body.username,
		password: body.password,
	};

	const user = await prisma.user.findFirst({
		where: { name: { equals: data.username } },
	});
	if (user == null)
		return res.status(401).send("Password or username incorrect");

	if (!bcrypt.compareSync(data.password, user.passHash))
		return res.status(401).send("Password or username incorrect");

	const session = await genNewSession(user.id);

	res.cookie("key", session, { httpOnly: true, sameSite: true })
		.status(200)
		.send();
});

app.get("/posts", async (req, res) => {
	if (!req.cookies["key"]) return res.status(401).send();

	const userId = await validateSession(req.cookies["key"]);
	if (userId == undefined) return res.status(401).send();

	const posts = await prisma.post.findMany({
		orderBy: { id: "desc" },
		take: 10,
	});

	res.json(posts);
});

app.listen(PORT, () => {
	console.log("server listening on http://localhost:" + PORT);
});
