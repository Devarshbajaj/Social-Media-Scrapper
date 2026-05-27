import Post from '../models/Post.js';
import PostCluster from '../models/PostCluster.js';
import nlpService from './nlpService.js';

export class ClusteringService {
  /**
   * Calculate similarity between two texts (0-1, where 1 = identical)
   */
  calculateSimilarity(text1, text2) {
    try {
      const words1 = new Set(text1.toLowerCase().split(/\s+/));
      const words2 = new Set(text2.toLowerCase().split(/\s+/));

      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);

      const similarity = intersection.size / union.size;
      return similarity;
    } catch (error) {
      console.error('Similarity calculation error:', error);
      return 0;
    }
  }

  /**
   * Cluster similar posts together
   */
  async clusterPosts(postsData = null) {
    try {
      // Fetch unclustered posts
      const posts = postsData || await Post.find({ clusterId: null }).limit(1000);

      if (posts.length === 0) {
        console.log('No posts to cluster');
        return [];
      }

      const clusters = [];
      const processedPostIds = new Set();

      for (let i = 0; i < posts.length; i++) {
        if (processedPostIds.has(posts[i]._id.toString())) continue;

        const mainPost = posts[i];
        const similarPosts = [mainPost];

        // Find all similar posts
        for (let j = i + 1; j < posts.length; j++) {
          if (processedPostIds.has(posts[j]._id.toString())) continue;

          const similarity = this.calculateSimilarity(
            mainPost.originalContent,
            posts[j].originalContent
          );

          // If similarity > 0.6, consider them similar
          if (similarity > 0.6) {
            similarPosts.push(posts[j]);
          }
        }

        // Only create cluster if there are multiple similar posts
        if (similarPosts.length > 1) {
          const clusterData = {
            title: mainPost.originalContent.substring(0, 100),
            description: nlpService.generateSummary(mainPost.originalContent),
            mainPostId: mainPost._id,
            relatedPostIds: similarPosts.slice(1).map(p => p._id),
            category: mainPost.category,
            sentiment: mainPost.sentiment,
            totalEngagement: similarPosts.reduce(
              (sum, p) => sum + (p.engagement?.likes || 0) + (p.engagement?.comments || 0),
              0
            ),
            uniquePlatforms: [...new Set(similarPosts.map(p => p.platform))],
            postCount: similarPosts.length,
            trending: similarPosts.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0) > 100,
          };

          // Save cluster
          const cluster = await PostCluster.create(clusterData);
          clusters.push(cluster);

          // Update all posts to reference this cluster
          const postIds = similarPosts.map(p => p._id);
          await Post.updateMany({ _id: { $in: postIds } }, { clusterId: cluster._id });

          // Mark as processed
          similarPosts.forEach(p => processedPostIds.add(p._id.toString()));
        } else {
          processedPostIds.add(mainPost._id.toString());
        }
      }

      console.log(`✅ Created ${clusters.length} clusters`);
      return clusters;
    } catch (error) {
      console.error('Clustering error:', error);
      throw error;
    }
  }

  /**
   * Get trending clusters
   */
  async getTrendingClusters(limit = 10) {
    try {
      const clusters = await PostCluster.find({ trending: true })
        .sort({ trendingScore: -1 })
        .limit(limit)
        .populate('mainPostId')
        .populate('relatedPostIds');

      return clusters;
    } catch (error) {
      console.error('Error fetching trending clusters:', error);
      throw error;
    }
  }

  /**
   * Get clusters by category
   */
  async getClustersByCategory(category, limit = 20) {
    try {
      const clusters = await PostCluster.find({ category })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('mainPostId')
        .populate('relatedPostIds');

      return clusters;
    } catch (error) {
      console.error('Error fetching clusters by category:', error);
      throw error;
    }
  }

  /**
   * Merge duplicate clusters
   */
  async mergeDuplicateClusters() {
    try {
      const clusters = await PostCluster.find();
      const mergedClusters = new Set();

      for (let i = 0; i < clusters.length; i++) {
        if (mergedClusters.has(clusters[i]._id.toString())) continue;

        for (let j = i + 1; j < clusters.length; j++) {
          if (mergedClusters.has(clusters[j]._id.toString())) continue;

          const similarity = this.calculateSimilarity(
            clusters[i].title,
            clusters[j].title
          );

          if (similarity > 0.7) {
            // Merge cluster j into cluster i
            clusters[i].relatedPostIds = [
              ...clusters[i].relatedPostIds,
              ...clusters[j].relatedPostIds,
              clusters[j].mainPostId,
            ];
            clusters[i].postCount += clusters[j].postCount;
            clusters[i].totalEngagement += clusters[j].totalEngagement;

            await clusters[i].save();
            await PostCluster.deleteOne({ _id: clusters[j]._id });

            mergedClusters.add(clusters[j]._id.toString());
          }
        }
      }

      console.log(`✅ Merged ${mergedClusters.size} duplicate clusters`);
      return mergedClusters.size;
    } catch (error) {
      console.error('Error merging duplicate clusters:', error);
      throw error;
    }
  }
}

export default new ClusteringService();
