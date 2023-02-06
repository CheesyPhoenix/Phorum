import type { RequestHandler } from "./$types";
import sqlite from "sqlite";
import sqlite3 from "sqlite3";

const db = await sqlite.open({
	filename: "./data/sessions.db",
	driver: sqlite3.Database,
});

export const GET = (async () => {
	return new Response();
}) satisfies RequestHandler;
