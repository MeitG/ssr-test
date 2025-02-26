import express from "express";
import path from "path";
import fs from "fs";

const app = express();

const serveStatic = (directory: string) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const filePath = path.join(directory, req.url);
    console.log(filePath);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        next();
      } else {
        res.sendFile(filePath);
      }
    });
  };
};

//use our own serveStatic function :D
app.use(serveStatic(path.join(__dirname, "public")));
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




