import mongoose from 'mongoose';

const scrapingJobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },
    platforms: [
      {
        type: String,
        enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'reddit', 'tiktok'],
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
    postsCollected: {
      type: Number,
      default: 0,
    },
    startedAt: Date,
    completedAt: Date,
    errorLog: [String],
    summary: {
      totalPosts: Number,
      validPosts: Number,
      gibberishPosts: Number,
      categorized: Number,
      summarized: Number,
      clustered: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ScrapingJob', scrapingJobSchema);
