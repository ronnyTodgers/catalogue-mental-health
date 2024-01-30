const express = require("express");
const morgan = require("morgan");
const sphp = require("sphp");

// Create Express Server
const app = express();

consolestream = {
  write: function (message, encoding) {
    console.info(message.trim());
  },
};

app.get("/", function (req, res) {
  res.sendFile("./index.php");
});

app.use(morgan("dev", { stream: consolestream }));
app.use("/", sphp.express("./"));
app.use("/", express.static("./"));

// Configuration
const PORT = 3000;
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
