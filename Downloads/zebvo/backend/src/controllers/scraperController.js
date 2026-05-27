import Post from '../models/Post.js';
import ScrapingJob from '../models/ScrapingJob.js';
import {
  TwitterScraper,
  RedditScraper,
  YouTubeScraper,
} from '../services/scraperService.js';
import clusteringService from '../services/clusteringService.js';
import { generateMockPosts } from '../utils/mockData.js';
import { v4 as uuidv4 } from 'uuid';

export class ScraperController {
  /**
   * Start scraping job
   */
  async startScraping(req, res) {
    try {
      const { platforms = ['twitter', 'reddit', 'youtube'] } = req.body;

      const jobId = uuidv4();
      const job = await ScrapingJob.create({
        jobId,
        platforms,
        status: 'pending',
      });

      // Run scraping asynchronously
      this.runScrapingJob(jobId, platforms);

      res.status(200).json({
        success: true,
        message: 'Scraping job started',
        jobId,
      });
    } catch (error) {
      console.error('Error starting scraping job:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Run scraping job
   */
  async runScrapingJob(jobId, platforms) {
    try {
      const job = await ScrapingJob.findOne({ jobId });
      if (!job) return;

      job.status = 'running';
      job.startedAt = new Date();
      await job.save();

      console.log(`🚀 Starting scraping job: ${jobId}`);

      let totalPosts = 0;
      let allPosts = [];
      const errors = [];

      // Initialize scrapers
      const scrapers = [];
      if (platforms.includes('twitter')) scrapers.push(new TwitterScraper());
      if (platforms.includes('reddit')) scrapers.push(new RedditScraper());
      if (platforms.includes('youtube')) scrapers.push(new YouTubeScraper());

      // Run scrapers
      for (const scraper of scrapers) {
        try {
          const posts = await scraper.scrape();
          if (posts && posts.length > 0) {
            allPosts.push(...posts);
            totalPosts += posts.length;
          }
        } catch (error) {
          console.error(`Error with ${scraper.platform} scraper:`, error.message);
          errors.push(`${scraper.platform}: ${error.message}`);
        }
      }

      // If no posts from scrapers, use mock data for demo
      if (allPosts.length === 0) {
        console.log('📝 No posts from scrapers, using mock data for demonstration...');
        allPosts = generateMockPosts(30);
        console.log(`✨ Generated ${allPosts.length} demo posts`);
      }

      // Save posts to database
      if (allPosts.length > 0) {
        const uniquePosts = this.deduplicatePosts(allPosts);
        const savedPosts = await Post.insertMany(uniquePosts, { ordered: false }).catch(
          error => {
            console.warn('Some posts failed to insert (likely duplicates):', error.message);
            return [];
          }
        );
        console.log(`✅ Saved ${savedPosts.length} unique posts to database`);
      }

      // Run clustering on new posts
      console.log('🔄 Running clustering...');
      await clusteringService.clusterPosts();

      // Update job
      job.status = 'completed';
      job.completedAt = new Date();
      job.postsCollected = allPosts.length;
      job.errorLog = errors;
      job.summary = {
        totalPosts: allPosts.length,
        validPosts: allPosts.filter(p => !p.isGibberish).length,
        gibberishPosts: allPosts.filter(p => p.isGibberish).length,
      };

      await job.save();

      console.log(`✅ Scraping job completed: ${jobId}`);
      console.log(`📊 Total posts: ${totalPosts}`);
    } catch (error) {
      console.error('Error running scraping job:', error);

      const job = await ScrapingJob.findOne({ jobId });
      if (job) {
        job.status = 'failed';
        job.completedAt = new Date();
        job.errorLog.push(error.message);
        await job.save();
      }
    }
  }

  /**
   * Deduplicate posts before saving
   */
  deduplicatePosts(posts) {
    const seen = new Set();
    return posts.filter(post => {
      if (seen.has(post.postId)) {
        return false;
      }
      seen.add(post.postId);
      return true;
    });
  }

  /**
   * Get scraping job status
   */
  async getJobStatus(req, res) {
    try {
      const { jobId } = req.params;

      const job = await ScrapingJob.findOne({ jobId });

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found',
        });
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      console.error('Error fetching job status:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get scraping history
   */
  async getScrapingHistory(req, res) {
    try {
      const { limit = 20, page = 1 } = req.query;

      const skip = (page - 1) * limit;

      const jobs = await ScrapingJob.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await ScrapingJob.countDocuments();

      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching scraping history:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new ScraperController();
