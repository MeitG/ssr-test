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
    const filePath = path.join(directory , req.url)
    fs.stat(filePath , (err , stats) => {
      if (err || !stats.isFile()) {
        return next()
      }
      else if (stats.isFile()) {
        res.sendFile(filePath)
      }
      else {
        next();
      }
    })
  }; 
}; 