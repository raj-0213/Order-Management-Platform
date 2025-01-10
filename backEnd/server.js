const express = require("express");
const http = require("http");
// require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost"; 

// Middleware to parse JSON
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: false }));

// Simple route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Create the server and start listening
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
