import express from 'express';
import PostController from '../controllers/postController.js';

const router = express.Router();

// Get all posts with filters
router.get('/', PostController.getPosts);

// Search posts
router.get('/search', PostController.searchPosts);

// Get statistics
router.get('/statistics', PostController.getStatistics);

// Get trending posts
router.get('/trending', PostController.getTrendingPosts);

// Get posts by platform
router.get('/platform/:platform', PostController.getPostsByPlatform);

// Get posts by category
router.get('/category/:category', PostController.getPostsByCategory);

// Get single post
router.get('/:id', PostController.getPostById);

// Create test posts (for demo/testing)
router.post('/test/generate', PostController.generateTestPosts);

export default router;
