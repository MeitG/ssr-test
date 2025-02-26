import express from "express";
import path from "path";
import fs from "fs";

/**
 * Middleware for serving static files with automatic HTML extension handling
 * @param directory The directory containing static files
 */
export const serveStatic = (directory: string) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Skip for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // If the URL is '/', serve index.html
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    
    // Determine the file path, adding .html extension if no extension exists
    const hasFileExtension = path.extname(urlPath) !== '';
    const filePath = hasFileExtension 
      ? path.join(directory, urlPath)
      : path.join(directory, urlPath + '.html');
    
    // Check if file exists and serve it
    fs.access(filePath, fs.constants.F_OK, (err) => {
      err ? next() : res.sendFile(filePath);
    });
  };
}; 