import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'reddit', 'tiktok'],
      required: true,
    },
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      handle: String,
      name: String,
      profileUrl: String,
      followers: Number,
      avatar: String,
    },
    originalContent: {
      type: String,
      required: true,
    },
    translations: {
      type: Map,
      of: String,
      default: {},
    },
    category: {
      type: String,
      enum: [
        'Application',
        'Renewal',
        'Appointments',
        'Tatkal',
        'Visa',
        'Travel Issues',
        'Government Announcements',
        'Scams/Fraud',
        'News',
        'Personal Experiences',
        'Other',
      ],
    },
    summary: String,
    gibberishScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    isGibberish: {
      type: Boolean,
      default: false,
    },
    clusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostCluster',
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
    sentimentScore: Number,
    engagement: {
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number,
    },
    mediaUrls: [String],
    postUrl: String,
    language: String,
    region: String,
    keywords: [String],
    publishedAt: Date,
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
postSchema.index({ platform: 1, publishedAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ isGibberish: 1 });
postSchema.index({ clusterId: 1 });
postSchema.index({ publishedAt: 1 });

export default mongoose.model('Post', postSchema);
