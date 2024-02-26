import express from "express";
import redis from "redis";
import fetch from "node-fetch";

const app = express();

const client = await redis
  .createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
client.configSet("", "");
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
