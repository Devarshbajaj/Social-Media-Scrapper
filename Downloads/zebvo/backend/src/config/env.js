import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-scraper',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  
  // Twitter/X
  TWITTER: {
    CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  },
  
  // Facebook
  FACEBOOK: {
    ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN,
    APP_ID: process.env.FACEBOOK_APP_ID,
    APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  },
  
  // Instagram
  INSTAGRAM: {
    USERNAME: process.env.INSTAGRAM_USERNAME,
    PASSWORD: process.env.INSTAGRAM_PASSWORD,
  },
  
  // LinkedIn
  LINKEDIN: {
    EMAIL: process.env.LINKEDIN_EMAIL,
    PASSWORD: process.env.LINKEDIN_PASSWORD,
  },
  
  // Reddit
  REDDIT: {
    CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    USER_AGENT: process.env.REDDIT_USER_AGENT,
  },
  
  // YouTube
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  
  // Translation
  GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY,
  TRANSLATE_API_KEY: process.env.TRANSLATE_API_KEY,
  
  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  
  // Scraping
  SCRAPE_INTERVAL: parseInt(process.env.SCRAPE_INTERVAL) || 3600,
  MAX_POSTS_PER_PLATFORM: parseInt(process.env.MAX_POSTS_PER_PLATFORM) || 500,
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE) || 50,
};

export default config;
