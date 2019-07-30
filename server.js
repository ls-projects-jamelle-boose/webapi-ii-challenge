const express = require("express");
const DataRouter = require("./data/data-router");
const server = express();

server.use(express.json());

server.use("/api/posts", DataRouter);

server.get("/", (req, res) => {
  res.send(`
  <p>Mollitia expedita sunt et quisquam ut.</p>
  <p>Eos eaque recusandae aliquid repellat.</p>
  `);
});

module.exports = server;
