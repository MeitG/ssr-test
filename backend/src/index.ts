import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/api";
import { auth } from "./middleware/auth";
import { serveStatic } from "./middleware/staticFiles";
import { AuthRequest } from "./utils/types";
import render from "./serverRender";
import Profile from "./components/profile";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, process.env.PUBLIC_DIR || "public");

// Add middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//our own implementation of static files middleware
app.use(serveStatic(PUBLIC_DIR));
// Mount API routes with /api prefix
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.get("/profile", auth, (req: AuthRequest, res) => {
  const auth = req.auth;
  if (auth?.isAuthenticated) {
    const user = auth.user;
    res.send(
      render(Profile(user!).render(), {
        title: "Profile",
        styles: ["/styles/profile.css", "/styles/navbar.css"],
        scripts: ["/scripts/profile.js", "/scripts/navbar.js"],
      })
    );
  } else {
    res.redirect(302, "/login");
  }
});

app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(PUBLIC_DIR, page + ".html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view your site`);
});
