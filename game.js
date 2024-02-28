import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const redis = new Redis();
const app = express();
redis.defineCommand("adduser", {
	numberOfKeys: 2,
	lua: fs.readFileSync(
		path.dirname(fileURLToPath(import.meta.url)) + "/script.lua"
	),
});

redis.defineCommand("createlobby", {
	numberOfKeys: 2,
	lua: fs.readFileSync(
		path.dirname(fileURLToPath(import.meta.url)) + "/lobby.lua"
	),
});

app.use(express.json());

app.post("/join/:lobby", async (req, res) => {
	const { lobby } = req.params;

	// const response = await redis.createlobby(lobby, req.body.username);
	// if (response == 0) {
	console.log(lobby, req.body.username);
	const allmembers = await redis.adduser(lobby, req.body.username);
	res.json({
		status: "OK",
		allmembers,
	});
	// }
});

app.listen(3000, () => {
	console.log("server running");
});
// (async () => {
// const [gid, players] = await redis.adduser(LOBBY, GAME, "tlhunter");
// console.log("GAME ID", gid, "PLAYERS", players.split(","));
// redis.quit();
// console.log(await redis.adduser(LOBBY, GAME, "cindy")); // null
// })();
