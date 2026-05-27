import PostCluster from '../models/PostCluster.js';
import clusteringService from '../services/clusteringService.js';

export class ClusterController {
  /**
   * Get all clusters
   */
  async getClusters(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        trending = false,
        category,
        sortBy = 'createdAt',
        order = -1,
      } = req.query;

      const query = {};
      if (trending) query.trending = true;
      if (category) query.category = category;

      const skip = (page - 1) * limit;
      const sortObj = { [sortBy]: order };

      const clusters = await PostCluster.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('mainPostId')
        .populate('relatedPostIds');

      const total = await PostCluster.countDocuments(query);

      res.status(200).json({
        success: true,
        data: clusters,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching clusters:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get cluster by ID
   */
  async getClusterById(req, res) {
    try {
      const { id } = req.params;
      const cluster = await PostCluster.findById(id)
        .populate('mainPostId')
        .populate('relatedPostIds');

      if (!cluster) {
        return res.status(404).json({
          success: false,
          error: 'Cluster not found',
        });
      }

      res.status(200).json({
        success: true,
        data: cluster,
      });
    } catch (error) {
      console.error('Error fetching cluster:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get trending clusters
   */
  async getTrendingClusters(req, res) {
    try {
      const { limit = 10 } = req.query;

      const clusters = await clusteringService.getTrendingClusters(parseInt(limit));

      res.status(200).json({
        success: true,
        data: clusters,
      });
    } catch (error) {
      console.error('Error fetching trending clusters:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get clusters by category
   */
  async getClustersByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 20 } = req.query;

      const clusters = await clusteringService.getClustersByCategory(category, parseInt(limit));

      res.status(200).json({
        success: true,
        data: clusters,
        category,
      });
    } catch (error) {
      console.error('Error fetching clusters by category:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Manually trigger clustering
   */
  async triggerClustering(req, res) {
    try {
      console.log('🔄 Triggering manual clustering...');
      const clusters = await clusteringService.clusterPosts();

      res.status(200).json({
        success: true,
        message: `Created ${clusters.length} clusters`,
        clusters,
      });
    } catch (error) {
      console.error('Error triggering clustering:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new ClusterController();
