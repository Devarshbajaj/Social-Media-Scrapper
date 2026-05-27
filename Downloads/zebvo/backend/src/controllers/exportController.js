import Post from '../models/Post.js';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export class ExportController {
  /**
   * Export posts to CSV
   */
  async exportToCSV(req, res) {
    try {
      const {
        platform,
        category,
        sentiment,
        excludeGibberish = true,
      } = req.query;

      const query = {};
      if (excludeGibberish) query.isGibberish = false;
      if (platform) query.platform = platform;
      if (category) query.category = category;
      if (sentiment) query.sentiment = sentiment;

      const posts = await Post.find(query).lean();

      // Prepare data for CSV
      const csvData = posts.map(post => ({
        'Post ID': post.postId,
        Platform: post.platform,
        Author: post.author.handle,
        Content: post.originalContent,
        Category: post.category,
        Sentiment: post.sentiment,
        Summary: post.summary,
        Likes: post.engagement.likes,
        Comments: post.engagement.comments,
        Shares: post.engagement.shares,
        'Published At': post.publishedAt,
        URL: post.postUrl,
      }));

      const csv = Papa.unparse(csvData);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="posts.csv"');
      res.send(csv);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Export posts to JSON
   */
  async exportToJSON(req, res) {
    try {
      const {
        platform,
        category,
        sentiment,
        excludeGibberish = true,
      } = req.query;

      const query = {};
      if (excludeGibberish) query.isGibberish = false;
      if (platform) query.platform = platform;
      if (category) query.category = category;
      if (sentiment) query.sentiment = sentiment;

      const posts = await Post.find(query).lean();

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="posts.json"');
      res.json({
        success: true,
        totalPosts: posts.length,
        data: posts,
        exportedAt: new Date(),
      });
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Export posts to Excel (XLSX)
   */
  async exportToExcel(req, res) {
    try {
      // Note: For production, use a proper Excel library like xlsx or exceljs
      const {
        platform,
        category,
        sentiment,
        excludeGibberish = true,
      } = req.query;

      const query = {};
      if (excludeGibberish) query.isGibberish = false;
      if (platform) query.platform = platform;
      if (category) query.category = category;
      if (sentiment) query.sentiment = sentiment;

      const posts = await Post.find(query).lean();

      // For now, return as JSON (use xlsx library for real Excel export)
      res.status(200).json({
        success: true,
        message: 'Excel export requires xlsx library',
        totalPosts: posts.length,
        data: posts,
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Generate report
   */
  async generateReport(req, res) {
    try {
      const report = {
        generatedAt: new Date(),
        summary: {},
        trends: {},
        topCategories: [],
        topPlatforms: [],
        sentimentBreakdown: {},
      };

      // Total stats
      const totalPosts = await Post.countDocuments();
      const validPosts = await Post.countDocuments({ isGibberish: false });
      const gibberishPosts = totalPosts - validPosts;

      report.summary = {
        totalPosts,
        validPosts,
        gibberishPosts,
        accuracy: ((validPosts / totalPosts) * 100).toFixed(2) + '%',
      };

      // Top categories
      const topCategories = await Post.aggregate([
        { $match: { isGibberish: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      report.topCategories = topCategories;

      // Top platforms
      const topPlatforms = await Post.aggregate([
        { $match: { isGibberish: false } },
        { $group: { _id: '$platform', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      report.topPlatforms = topPlatforms;

      // Sentiment breakdown
      const sentimentStats = await Post.aggregate([
        { $match: { isGibberish: false } },
        { $group: { _id: '$sentiment', count: { $sum: 1 } } },
      ]);
      sentimentStats.forEach(stat => {
        report.sentimentBreakdown[stat._id] = stat.count;
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new ExportController();
