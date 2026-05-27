import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { config } from './config/env.js';
import postRoutes from './routes/posts.js';
import clusterRoutes from './routes/clusters.js';
import scraperRoutes from './routes/scraper.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from frontend build
app.use(express.static(frontendDistPath));

// Connect to Database
connectDB();

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Social Media Scraper Dashboard API is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/export', exportRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
});

// Catch-all for React SPA - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath);
});

// Start Server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
});

export default app;
