import express from 'express';
import ExportController from '../controllers/exportController.js';

const router = express.Router();

// Export to CSV
router.get('/csv', ExportController.exportToCSV);

// Export to JSON
router.get('/json', ExportController.exportToJSON);

// Export to Excel
router.get('/excel', ExportController.exportToExcel);

// Generate report
router.get('/report', ExportController.generateReport);

export default router;
