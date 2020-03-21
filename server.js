const express = require("express");
const server = express();
// const projectRouter = require("./project/projectRouter.js");
// const actionRouter = require("./action/actionRouter.js");

server.use(express.json());
server.use(log);
// server.use("/api/project", projectRouter);
// server.use("/api/action", actionRouter);

server.get("/", (req, res) => {
  res.send(`
        <h1>Node Api Sprint</h1>
    `);
});

function log(req, res, next) {
  const d = new Date();
  console.log(
    `${req.method} Request Made At URL(${
      req.url
    }) On ${d.getMonth()}/${d.getDay()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`
  );
  next();
}

module.exports = server;
