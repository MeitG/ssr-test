import express from "express";
import path from "path";
import dotenv from "dotenv";
import apiRoutes from './routes/api';
import staticRoutes from './routes/static';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, process.env.PUBLIC_DIR || "public");

// Add middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes with /api prefix
app.use('/api', apiRoutes);

// Mount static routes (everything else)
app.use(staticRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view your site`);
});




