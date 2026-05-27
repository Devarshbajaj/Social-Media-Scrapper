import mongoose from 'mongoose';

const postClusterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    mainPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    relatedPostIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
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
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
    totalEngagement: Number,
    uniquePlatforms: [String],
    postCount: Number,
    trending: {
      type: Boolean,
      default: false,
    },
    trendingScore: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PostCluster', postClusterSchema);
