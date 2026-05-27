import express from 'express';
import ScraperController from '../controllers/scraperController.js';

const router = express.Router();

// Start scraping
router.post('/start', ScraperController.startScraping);

// Get job status
router.get('/job/:jobId', ScraperController.getJobStatus);

// Get scraping history
router.get('/history', ScraperController.getScrapingHistory);

export default router;
