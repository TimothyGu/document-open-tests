"use strict";

const http = require("http");

const slowPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg==", "base64");

const server = http.createServer((req, res) => {
  if (req.url.includes("load.html")) {
    res.setHeader("Content-Type", "text/html");
    res.end(`
      <!DOCTYPE html>
      <meta charset=utf-8>
      <p>First content</p>
      <iframe src="http://localhost:8888/slow.html"></iframe>
      <script>
        document.domain = "localhost";
        window.addEventListener("load", () => {
          console.log("main frame window load event");
        });
        const iframe = document.getElementsByTagName("iframe")[0];
        iframe.addEventListener("load", () => {
          console.log("iframe load event");
          //setTimeout(() => {
            console.log("calling iframe.contentDocument.open");
            iframe.contentDocument.open();
          //}, 1000);
        });
        console.log("main script");
      </script>
      <p>More content</p>
    `);
  } else if (req.url.includes("slow.html")) {
    res.setHeader("Content-Type", "text/html");
    res.write(`
      <!DOCTYPE html>
      <meta charset=utf-8>
      <script>
        document.domain = "localhost";
        console.log("frame script");
        window.addEventListener("load", () => {
          console.log("subframe window load event");
        });
      </script>
      <p>slowly
    `);
    setTimeout(() => {
      res.end("rendered</p>");
    }, 5000);
  } else if (req.url.includes("slow2.html")) {
    res.setHeader("Content-Type", "text/html");
    res.write(`
      <!DOCTYPE html>
      <meta charset=utf-8>
      <script>
        document.onreadystatechange = () => {
          console.log(document.readyState);
        };
        setTimeout(() => {
          console.log('opening');
          document.open();
        });
      </script>
      <p>slowly
    `);
    setTimeout(() => {
      res.end("rendered</p>");
    }, 5000);
  } else if (req.url.includes("slow.js")) {
    setTimeout(() => {
      res.setHeader("Content-Type", "text/javascript");
      res.end("void 0;");
    }, 5000);
  } else if (req.url.includes("slow.png")) {
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
