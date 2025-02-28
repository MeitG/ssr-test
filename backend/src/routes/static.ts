import express from 'express';
import path from 'path';
import { serveStatic } from '../middleware/staticFiles';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const PUBLIC_DIR = path.join(__dirname, '..', process.env.PUBLIC_DIR || 'public');



// Serve static files
router.use(serveStatic(PUBLIC_DIR));

// 404 handler for static routes
router.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

export default router; 