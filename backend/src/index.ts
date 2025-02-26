import express from "express";
import path from "path";

const app = express();

app.get("/", (req, res) => {
  console.log(path.join(__dirname, "public/index.html"));
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public/about.html"));
});

app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/components", express.static(path.join(__dirname, "components")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

