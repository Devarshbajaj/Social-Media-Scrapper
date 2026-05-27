import axios from 'axios';
import { config } from '../config/env.js';
import nlpService from './nlpService.js';
import translationService from './translationService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base Scraper Class - handles common scraping logic
 */
export class BaseScraper {
  constructor(platform) {
    this.platform = platform;
    this.keyword = 'passport';
    this.maxResults = config.MAX_POSTS_PER_PLATFORM || 100;
  }

  /**
   * Process scraped post - add NLP analysis
   */
  async processPost(rawPost) {
    try {
      const gibberish = nlpService.detectGibberish(rawPost.content);
      const sentiment = nlpService.analyzeSentiment(rawPost.content);
      const category = nlpService.categorizePost(rawPost.content);
      const summary = nlpService.generateSummary(rawPost.content);
      const keywords = nlpService.extractKeywords(rawPost.content);

      // Translate content
      const translations = await translationService.translateToMultipleLanguages(
        rawPost.content,
        ['hi', 'pa', 'es', 'fr', 'de', 'ar', 'zh', 'ru', 'ja']
      );

      return {
        platform: this.platform,
        postId: rawPost.postId || uuidv4(),
        author: {
          handle: rawPost.author?.handle || 'Unknown',
          name: rawPost.author?.name || 'Unknown',
          profileUrl: rawPost.author?.profileUrl || '',
          followers: rawPost.author?.followers || 0,
          avatar: rawPost.author?.avatar || '',
        },
        originalContent: rawPost.content,
        translations,
        category,
        summary,
        gibberishScore: gibberish.score,
        isGibberish: gibberish.isGibberish,
        sentiment: sentiment.sentiment,
        sentimentScore: sentiment.score,
        engagement: {
          likes: rawPost.engagement?.likes || 0,
          comments: rawPost.engagement?.comments || 0,
          shares: rawPost.engagement?.shares || 0,
          views: rawPost.engagement?.views || 0,
        },
        mediaUrls: rawPost.mediaUrls || [],
        postUrl: rawPost.postUrl || '',
        language: rawPost.language || 'en',
        region: rawPost.region || '',
        keywords,
        publishedAt: rawPost.publishedAt || new Date(),
      };
    } catch (error) {
      console.error(`Error processing post from ${this.platform}:`, error);
      return null;
    }
  }
}

/**
 * Twitter/X Scraper
 */
export class TwitterScraper extends BaseScraper {
  constructor() {
    super('twitter');
  }

  async scrape() {
    try {
      console.log(`🐦 Scraping Twitter/X for "${this.keyword}"...`);

      // Implementation using Twitter API v2
      // Requires: TWITTER_BEARER_TOKEN
      const bearerToken = config.TWITTER.BEARER_TOKEN;

      if (!bearerToken) {
        console.warn('⚠️  Twitter Bearer Token not configured');
        return [];
      }

      const url = 'https://api.twitter.com/2/tweets/search/recent';
      const params = {
        query: `${this.keyword} -is:retweet lang:en`,
        max_results: Math.min(this.maxResults, 100),
        'tweet.fields': 'created_at,author_id,public_metrics,lang',
        'user.fields': 'username,name,public_metrics',
        expansions: 'author_id',
      };

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        params,
      });

      const posts = [];
      if (response.data.data) {
        for (const tweet of response.data.data) {
          const user = response.data.includes?.users?.find(u => u.id === tweet.author_id);

          const processedPost = await this.processPost({
            postId: tweet.id,
            content: tweet.text,
            author: {
              handle: user?.username || '',
              name: user?.name || '',
              followers: user?.public_metrics?.followers_count || 0,
            },
            engagement: {
              likes: tweet.public_metrics?.like_count || 0,
              comments: tweet.public_metrics?.reply_count || 0,
              shares: tweet.public_metrics?.retweet_count || 0,
            },
            postUrl: `https://twitter.com/${user?.username}/status/${tweet.id}`,
            publishedAt: new Date(tweet.created_at),
            language: tweet.lang,
          });

          if (processedPost && !processedPost.isGibberish) {
            posts.push(processedPost);
          }
        }
      }

      console.log(`✅ Scraped ${posts.length} valid posts from Twitter`);
      return posts;
    } catch (error) {
      console.error('Twitter scraping error:', error);
      return [];
    }
  }
}

/**
 * Reddit Scraper
 */
export class RedditScraper extends BaseScraper {
  constructor() {
    super('reddit');
  }

  async scrape() {
    try {
      console.log(`🤖 Scraping Reddit for "${this.keyword}"...`);

      // Implementation using PRAW (Python Reddit API Wrapper)
      // For now, using public API without authentication
      const url = `https://www.reddit.com/r/all/search.json?q=${this.keyword}&sort=new&limit=${this.maxResults}`;

      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const posts = [];
      if (response.data.data?.children) {
        for (const item of response.data.data.children) {
          const post = item.data;

          const processedPost = await this.processPost({
            postId: post.id,
            content: post.title + ' ' + (post.selftext || ''),
            author: {
              handle: post.author || 'Unknown',
              name: post.author || 'Unknown',
              followers: post.author_cakeday ? 1 : 0,
            },
            engagement: {
              likes: post.ups || 0,
              comments: post.num_comments || 0,
            },
            postUrl: `https://reddit.com${post.permalink}`,
            publishedAt: new Date(post.created_utc * 1000),
          });

          if (processedPost && !processedPost.isGibberish) {
            posts.push(processedPost);
          }
        }
      }

      console.log(`✅ Scraped ${posts.length} valid posts from Reddit`);
      return posts;
    } catch (error) {
      console.error('Reddit scraping error:', error);
      return [];
    }
  }
}

/**
 * YouTube Scraper (using API)
 */
export class YouTubeScraper extends BaseScraper {
  constructor() {
    super('youtube');
  }

  async scrape() {
    try {
      console.log(`📹 Scraping YouTube for "${this.keyword}"...`);

      const apiKey = config.YOUTUBE_API_KEY;
      if (!apiKey) {
        console.warn('⚠️  YouTube API Key not configured');
        return [];
      }

      const url = 'https://www.googleapis.com/youtube/v3/search';
      const params = {
        key: apiKey,
        q: this.keyword,
        type: 'video',
        part: 'snippet',
        maxResults: Math.min(this.maxResults, 50),
        order: 'date',
        regionCode: 'IN',
      };

      const response = await axios.get(url, { params });

      const posts = [];
      if (response.data.items) {
        for (const item of response.data.items) {
          const snippet = item.snippet;

          const processedPost = await this.processPost({
            postId: item.id.videoId,
            content: `${snippet.title} - ${snippet.description}`,
            author: {
              name: snippet.channelTitle,
              handle: snippet.channelTitle,
            },
            postUrl: `https://youtube.com/watch?v=${item.id.videoId}`,
            publishedAt: new Date(snippet.publishedAt),
            mediaUrls: [snippet.thumbnails.medium?.url],
          });

          if (processedPost && !processedPost.isGibberish) {
            posts.push(processedPost);
          }
        }
      }

      console.log(`✅ Scraped ${posts.length} valid posts from YouTube`);
      return posts;
    } catch (error) {
      console.error('YouTube scraping error:', error);
      return [];
    }
  }
}

/**
 * Generic Web Scraper (for other platforms)
 */
export class WebScraper extends BaseScraper {
  constructor(platform, searchUrl) {
    super(platform);
    this.searchUrl = searchUrl;
  }

  async scrape() {
    try {
      console.log(`🕷️  Scraping ${this.platform}...`);
      // Implementation would depend on each platform's public interface
      return [];
    } catch (error) {
      console.error(`${this.platform} scraping error:`, error);
      return [];
    }
  }
}

export default {
  TwitterScraper,
  RedditScraper,
  YouTubeScraper,
  WebScraper,
};
