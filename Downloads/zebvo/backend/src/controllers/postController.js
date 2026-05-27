import Post from '../models/Post.js';
import PostCluster from '../models/PostCluster.js';
import clusteringService from '../services/clusteringService.js';
import { generateMockPosts } from '../utils/mockData.js';
import memoryStore from '../services/memoryStore.js';

export class PostController {
  /**
   * Get all posts with filters
   */
  async getPosts(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        platform,
        category,
        sentiment,
        sortBy = 'publishedAt',
        order = -1,
        search,
        excludeGibberish = true,
      } = req.query;

      const query = {};

      if (excludeGibberish) {
        query.isGibberish = false;
      }
      if (platform) query.platform = platform;
      if (category) query.category = category;
      if (sentiment) query.sentiment = sentiment;

      if (search) {
        query.$or = [
          { originalContent: { $regex: search, $options: 'i' } },
          { 'translations.en': { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const sortObj = { [sortBy]: order };

      let posts, total;

      try {
        posts = await Post.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit));

        total = await Post.countDocuments(query);
      } catch (dbError) {
        // Fallback to memory store
        console.log('📚 Using in-memory store (MongoDB unavailable)');
        const filters = { platform, category, sentiment, search };
        const result = memoryStore.getPosts(filters, parseInt(limit), skip);
        posts = result.posts;
        total = result.total;
      }

      res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get single post by ID
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get posts by platform
   */
  async getPostsByPlatform(req, res) {
    try {
      const { platform } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const skip = (page - 1) * limit;

      const posts = await Post.find({ platform, isGibberish: false })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Post.countDocuments({ platform, isGibberish: false });

      res.status(200).json({
        success: true,
        data: posts,
        platform,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching posts by platform:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const skip = (page - 1) * limit;

      const posts = await Post.find({ category, isGibberish: false })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Post.countDocuments({ category, isGibberish: false });

      res.status(200).json({
        success: true,
        data: posts,
        category,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Search posts
   */
  async searchPosts(req, res) {
    try {
      const { q } = req.query;
      const { page = 1, limit = 20 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }

      const skip = (page - 1) * limit;

      const posts = await Post.find({
        $or: [
          { originalContent: { $regex: q, $options: 'i' } },
          { 'translations.en': { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { keywords: { $in: [q] } },
        ],
        isGibberish: false,
      })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Post.countDocuments({
        $or: [
          { originalContent: { $regex: q, $options: 'i' } },
          { 'translations.en': { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
        ],
      });

      res.status(200).json({
        success: true,
        data: posts,
        query: q,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error searching posts:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get statistics
   */
  async getStatistics(req, res) {
    try {
      let stats;

      try {
        // Try MongoDB first
        stats = {
          totalPosts: await Post.countDocuments(),
          validPosts: await Post.countDocuments({ isGibberish: false }),
          gibberishPosts: await Post.countDocuments({ isGibberish: true }),
          byPlatform: {},
          byCategory: {},
          bySentiment: {},
        };

        // Posts by platform
        const platformStats = await Post.aggregate([
          { $match: { isGibberish: false } },
          { $group: { _id: '$platform', count: { $sum: 1 } } },
        ]);
        platformStats.forEach(stat => {
          stats.byPlatform[stat._id] = stat.count;
        });

        // Posts by category
        const categoryStats = await Post.aggregate([
          { $match: { isGibberish: false } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        categoryStats.forEach(stat => {
          stats.byCategory[stat._id] = stat.count;
        });

        // Posts by sentiment
        const sentimentStats = await Post.aggregate([
          { $match: { isGibberish: false } },
          { $group: { _id: '$sentiment', count: { $sum: 1 } } },
        ]);
        sentimentStats.forEach(stat => {
          stats.bySentiment[stat._id] = stat.count;
        });
      } catch (dbError) {
        // Fallback to memory store
        console.log('📚 Using in-memory store for statistics');
        stats = memoryStore.getStatistics();
      }

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get trending posts
   */
  async getTrendingPosts(req, res) {
    try {
      const { limit = 10 } = req.query;

      const posts = await Post.find({ isGibberish: false })
        .sort({
          'engagement.likes': -1,
          'engagement.comments': -1,
          'engagement.shares': -1,
        })
        .limit(parseInt(limit));

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Generate test posts (for demo purposes)
   */
  async generateTestPosts(req, res) {
    try {
      const { count = 50 } = req.body;

      // Generate mock posts
      const mockPosts = generateMockPosts(count);

      // Always save to memory store first (fast response)
      console.log(`📚 Saving ${mockPosts.length} test posts to in-memory store`);
      memoryStore.addPosts(mockPosts);

      // Try to also save to MongoDB asynchronously (non-blocking)
      try {
        setTimeout(() => {
          Post.insertMany(mockPosts).catch(err => {
            console.log('📝 MongoDB save deferred (will retry on next generation)');
          });
        }, 100);
      } catch (err) {
        // Ignore MongoDB errors - we already saved to memory
      }

      console.log(`✅ Generated ${mockPosts.length} test posts (in-memory)`);

      res.status(200).json({
        success: true,
        message: `Generated ${mockPosts.length} test posts!`,
        count: mockPosts.length,
        status: 'Posts added to dashboard',
      });
    } catch (error) {
      console.error('Error generating test posts:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new PostController();
