import express from "express";
import path from "path";
import fs from "fs";

const app = express();

const serveStatic = (directory: string) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("req.url : ", req.url);
    // If the URL is '/', change it to '/index.html'
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    
    // Check if the URL doesn't have a file extension
    const hasFileExtension = path.extname(urlPath) !== '';
    
    // Determine the file path based on whether there's an extension
    let filePath;
    if (hasFileExtension) {
      filePath = path.join(directory, urlPath);
    } else {
      filePath = path.join(directory, urlPath + '.html');
    }
    
    console.log("filePath : ", filePath);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        next(); // File not found
      } else {
        res.sendFile(filePath); // File exists
      }
    });
  };
};

//use our own serveStatic function :D
app.use(serveStatic(path.join(__dirname, "public")));

// No need for a specific route for '/' as it's handled by the serveStatic middleware

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Visit http://localhost:3000 to view your site");
});




