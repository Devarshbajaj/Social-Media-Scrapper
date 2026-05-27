# Social Media Scraper Dashboard

A comprehensive full-stack application to aggregate and intelligently organize social media content related to passports from the last 24 hours. Built with modern web technologies and advanced NLP capabilities.

## 🎯 Features

### Core Features
- **Real-time Scraping**: Fetch passport-related posts from 7+ social media platforms
  - Twitter/X, Facebook, Instagram, LinkedIn, YouTube, Reddit, TikTok
  
- **Natural Language Processing**:
  - Auto-categorization (10+ categories)
  - Gibberish/spam detection
  - Sentiment analysis (positive, negative, neutral)
  - 30-word AI summaries
  - Keyword extraction

- **Multi-language Translation**:
  - Support for 10+ languages
  - One-click translation
  - Languages: English, Hindi, Punjabi, Spanish, French, German, Arabic, Chinese, Russian, Japanese

- **Intelligent Clustering**:
  - Duplicate detection
  - Related posts grouping
  - Trending post identification

- **Advanced Filtering & Sorting**:
  - By platform, category, sentiment, language
  - By creator, region, engagement level
  - Time-based filtering
  - Search across original and translated content

- **Export & Reporting**:
  - Export to CSV, JSON, Excel
  - Comprehensive reports
  - Category distributions
  - Platform analytics
  - Sentiment breakdown

### UI/UX
- Clean, responsive dashboard
- Mobile-friendly design
- Real-time statistics
- Intuitive navigation
- Interactive charts and visualizations

## 📁 Project Structure

```
social-media-scraper-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── scrapers/         # Platform-specific scrapers
│   │   ├── nlp/              # NLP utilities
│   │   ├── utils/            # Helper functions
│   │   └── server.js         # Main server file
│   ├── .env.example          # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API client
│   │   ├── context/          # State management (Zustand)
│   │   ├── styles/           # Global styles
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/
│   ├── API_DOCUMENTATION.md  # API endpoints guide
│   ├── SETUP.md              # Installation guide
│   ├── ARCHITECTURE.md       # System design
│   └── POSTMAN_COLLECTION.md # Postman API collection
│
├── .env.example              # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp ../.env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
mongod
```

4. **Run Server**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Full System Startup

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - MongoDB
mongod

# Terminal 3 - Frontend
cd frontend && npm run dev
```

## 🔧 Technology Stack

### Frontend
- **React 18**: UI library
- **Vite**: Lightning-fast build tool
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Lucide React**: Icon library

### Backend
- **Node.js + Express**: Web framework
- **MongoDB + Mongoose**: Database
- **Natural**: NLP library
- **Sentiment**: Sentiment analysis
- **Compromise**: Text processing
- **Axios**: HTTP requests
- **Cheerio**: Web scraping
- **Google Translate API**: Translation

### DevOps & Deployment
- **Vite**: Frontend bundler
- **Nodemon**: Backend hot reload
- **Docker**: Containerization (ready)
- **GitHub Actions**: CI/CD (ready)

## 📊 API Endpoints

### Posts
- `GET /api/posts` - Get all posts with filters
- `GET /api/posts/search` - Search posts
- `GET /api/posts/statistics` - Get statistics
- `GET /api/posts/trending` - Get trending posts
- `GET /api/posts/platform/:platform` - Posts by platform
- `GET /api/posts/category/:category` - Posts by category

### Clusters
- `GET /api/clusters` - Get clusters
- `GET /api/clusters/trending` - Trending clusters
- `GET /api/clusters/category/:category` - Clusters by category
- `POST /api/clusters/trigger` - Trigger clustering

### Scraper
- `POST /api/scraper/start` - Start scraping job
- `GET /api/scraper/job/:jobId` - Job status
- `GET /api/scraper/history` - Scraping history

### Export
- `GET /api/export/csv` - Export to CSV
- `GET /api/export/json` - Export to JSON
- `GET /api/export/report` - Generate report

## 🗄️ Database Schema

### Post Model
```javascript
{
  platform: String,
  postId: String (unique),
  author: {
    handle: String,
    name: String,
    followers: Number,
    avatar: String
  },
  originalContent: String,
  translations: Map<Language, String>,
  category: String,
  summary: String,
  gibberishScore: Number (0-1),
  isGibberish: Boolean,
  sentiment: String,
  engagement: {
    likes: Number,
    comments: Number,
    shares: Number,
    views: Number
  },
  keywords: [String],
  clusterId: ObjectId,
  publishedAt: Date
}
```

### PostCluster Model
```javascript
{
  title: String,
  description: String,
  mainPostId: ObjectId,
  relatedPostIds: [ObjectId],
  category: String,
  sentiment: String,
  postCount: Number,
  trending: Boolean,
  trendingScore: Number
}
```

## 🔐 Environment Configuration

Create `.env` file in root:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/social-media-scraper

# API Keys
TWITTER_BEARER_TOKEN=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
YOUTUBE_API_KEY=
GOOGLE_TRANSLATE_API_KEY=

# Frontend
VITE_API_URL=http://localhost:5000/api
```

## 📈 Usage Guide

### Starting a Scraping Job
1. Go to Settings page
2. Select platforms to scrape
3. Click "Start Scraping"
4. Monitor progress and view results

### Filtering Posts
1. Go to Posts page
2. Use filter panel for:
   - Platform
   - Category
   - Sentiment
   - Quality (gibberish)
3. Search bar for keyword search

### Viewing Statistics
1. Go to Statistics page
2. View real-time analytics
3. Export data as CSV/JSON
4. Generate comprehensive reports

### Translating Content
1. Click "Translate" on any post
2. Select target language
3. View translated content

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev              # Start with hot reload
npm test                # Run tests (to be added)
npm start               # Production mode
```

### Frontend Development
```bash
cd frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run type-check      # TypeScript validation
```

### Building Docker Images
```bash
docker build -t social-scraper-backend ./backend
docker build -t social-scraper-frontend ./frontend

docker run -p 5000:5000 social-scraper-backend
docker run -p 3000:3000 social-scraper-frontend
```

## 📋 Feature Roadmap

- [ ] User authentication & authorization
- [ ] Advanced filtering with date ranges
- [ ] Scheduled scraping jobs
- [ ] Custom alerts & notifications
- [ ] Machine learning-based ranking
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Mobile app
- [ ] Real-time WebSocket updates
- [ ] Data visualization charts
- [ ] Custom dashboards

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 📧 Support

For issues and questions:
- Open GitHub Issues
- Email: support@socialscraper.dev
- Discord: [Join our community]

## 🙏 Acknowledgments

- Natural language processing powered by Natural.js
- Design inspired by modern dashboard UX
- Community feedback and contributions

---

**Built with ❤️ for college students and developers**

Last Updated: May 2026
