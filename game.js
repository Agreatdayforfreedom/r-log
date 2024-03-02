import Redis from "ioredis";
import fs from "fs";
import path from "path";
import crypto from "crypto";
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

redis.defineCommand("updateLeaderboard", {
	numberOfKeys: 3,
	lua: fs.readFileSync(
		path.dirname(fileURLToPath(import.meta.url)) + "/leaderboard.lua"
	),
});

app.use(express.json());
app.post("/join/:lobby", async (req, res) => {
	let randomWinner = Math.floor(Math.random() * 4);
	const { lobby } = req.params;

	const allmembers = await redis.adduser(
		lobby,
		req.body.username,
		crypto.randomUUID()
	);
	if (allmembers.length === 1) {
		return res.json({
			status: "OK",
			allmembers,
		});
	}
	let members = allmembers[1].split(",");

	let winner = members[randomWinner];
	let score = Math.ceil(Math.random() * 100).toString();
	console.log({ members, winner, score });
	const leaderboard = await redis.updateLeaderboard(
		"duels_scores",
		winner,
		score
	);
	console.log({ leaderboard });

	res.json({
		status: "OK",
		leaderboard,
	});
});

app.listen(3000, () => {
	console.log("server running");
});
