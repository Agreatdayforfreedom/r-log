import fs from "fs";
import os from "os";
import express from "express";
import Redis from "ioredis";
import fetch from "node-fetch";

const app = express();

const client = new Redis();

client.monitor((err, monitor) => {
  monitor.on("monitor", (time, args, source, database) => {
    console.log({ time, args, source, database });
    if (!fs.existsSync("./TMP")) {
      fs.mkdirSync("./TMP");
    }
    fs.writeFileSync("./TMP/log.txt", JSON.stringify({ time, args, source, database }) + os.EOL, { flag: "a" });
  });
});
app.get("/all", async (req, res) => {
  const posts = await client.get("posts");
  if (posts != null) {
    console.log("cache hit");
    res.json(JSON.parse(posts));
  } else {
    console.log("uncached");
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    await client.set("posts", JSON.stringify(data));
    res.json(data);
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
