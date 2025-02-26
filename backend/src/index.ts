import express from "express";
import path from "path";
import fs from "fs";

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Visit http://localhost:3000 to view your site");
});

