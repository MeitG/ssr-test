import express from "express";
import path from "path";
import fs from "fs";

const app = express();

// Serve static files
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/components", express.static(path.join(__dirname, "components")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Dynamic routing for HTML pages
app.get("/:page", (req, res) => {
  const pageName = req.params.page;
  const filePath = path.join(__dirname, `public/${pageName}.html`);
  
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, send 404 page or redirect to home
      return res.status(404).sendFile(path.join(__dirname, "public/404.html"));
    }
    
    // File exists, send it
    res.sendFile(filePath);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

