import { PrismaClient } from "@prisma/client";
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { genNewSession } from "./genSession";

const app = express();
app.use(cookieParser());

const prisma = new PrismaClient();

const PORT = 8080;

app.get("/", (req, res) => {
	res.send("Hello World");
});

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
app.post("/login", (req, res) => {});

app.listen(PORT, () => {
	console.log("server listening on http://localhost:" + PORT);
});
