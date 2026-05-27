import express from 'express';
import ClusterController from '../controllers/clusterController.js';

const router = express.Router();

// Get all clusters
router.get('/', ClusterController.getClusters);

// Get trending clusters
router.get('/trending', ClusterController.getTrendingClusters);

// Get clusters by category
router.get('/category/:category', ClusterController.getClustersByCategory);

// Trigger clustering
router.post('/trigger', ClusterController.triggerClustering);

// Get cluster by ID
router.get('/:id', ClusterController.getClusterById);

export default router;
