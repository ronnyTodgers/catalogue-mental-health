const express = require("express");
const morgan = require("morgan");
const sphp = require("sphp");
const path = require("path");

const ROOT_DIR = path.join(__dirname) + '/build/';

// Create Express Server
const app = express();

consolestream = {
  write: function (message, encoding) {
    console.info(message.trim());
  },
};

app.use(morgan("dev", { stream: consolestream }));
// Handle PHP files first
app.use("/", sphp.express(ROOT_DIR));
// Then serve static files
app.use("/", express.static(ROOT_DIR));

// Redirect root to index.php
app.get("/", function (req, res) {
  res.redirect("/index.php");
});

// Configuration
const PORT = 3111;
const HOST = "localhost";
// Logging

// Info GET endpoint
app.get("/info", (req, res, next) => {
  res.send("This is a proxy service for local development");
});

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
