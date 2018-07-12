"use strict";

const http = require("http");

const slowPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg==", "base64");

const server = http.createServer((req, res) => {
  if (req.url.includes("slow.png")) {
    setTimeout(() => {
      res.setHeader("Content-Type", "image/png");
      res.end(slowPng);
    }, 5000);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not found");
  }
});

server.listen(8888);
