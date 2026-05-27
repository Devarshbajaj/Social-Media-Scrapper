# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                      │
│  Dashboard | Posts | Clusters | Statistics | Settings            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                          HTTP/REST
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                   Backend Server (Express.js)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Routes                              │ │
│  │  /api/posts  /api/clusters  /api/scraper  /api/export    │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │                                             │
│  ┌────────────────▼─────────────────────────────────────────┐ │
│  │                   Controllers                            │ │
│  │  PostController | ClusterController | ScraperController │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │                                             │
│  ┌────────────────▼─────────────────────────────────────────┐ │
│  │                    Services                              │ │
│  │  NLP | Translation | Clustering | Scraper               │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │                                             │
│  ┌────────────────▼─────────────────────────────────────────┐ │
│  │                     Models                               │ │
│  │  Post | PostCluster | ScrapingJob                        │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │                                             │
└───────────────────┼─────────────────────────────────────────────┘
                    │
       ┌────────────┴─────────────┐
       │                          │
┌──────▼────────────┐  ┌─────────▼───────────┐
│   MongoDB Atlas   │  │  External APIs      │
│   (Database)      │  │  Twitter/Reddit/YT  │
│                   │  │  Google Translate   │
└───────────────────┘  └─────────────────────┘
```

## Data Flow

```
1. DATA COLLECTION
   Social Media → Scrapers → Raw Posts

2. PROCESSING
   Raw Posts → NLP Analysis
      ├─ Gibberish Detection
      ├─ Sentiment Analysis
      ├─ Auto-Categorization
      └─ Summary Generation

3. TRANSLATION
   Posts → Translation Service → Multi-language Content

4. CLUSTERING
   Posts → Similarity Analysis → Grouped Posts

5. STORAGE
   Processed Posts → MongoDB

6. RETRIEVAL & DISPLAY
   MongoDB ← API ← Frontend Dashboard
```

## Component Breakdown

### Frontend Components
- **Dashboard**: Overview and statistics
- **Posts**: Posts display with filters
- **Clusters**: Grouped and related posts
- **Statistics**: Reports and analytics
- **Settings**: Scraper configuration

### Backend Services
- **NLPService**: Text analysis and categorization
- **TranslationService**: Multi-language translation
- **ClusteringService**: Post similarity and grouping
- **ScraperService**: Multi-platform data collection

### Database Models
- **Post**: Individual posts with metadata
- **PostCluster**: Grouped related posts
- **ScrapingJob**: Scraping job tracking

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite (build tool)
- Zustand (state management)
- Axios (HTTP client)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Natural Language Processing (NLP)
- Web scraping libraries
- Translation APIs

### Deployment
- Frontend: Vercel, Netlify, or AWS S3
- Backend: Heroku, AWS EC2, or DigitalOcean
- Database: MongoDB Atlas
- Caching: Redis (optional)

## Data Processing Pipeline

```
START SCRAPING
    ↓
Collect raw posts from platforms
    ↓
Detect & remove gibberish
    ↓
Analyze sentiment
    ↓
Auto-categorize posts
    ↓
Generate summaries
    ↓
Extract keywords
    ↓
Translate to multiple languages
    ↓
Group similar posts (clustering)
    ↓
Save to MongoDB
    ↓
Display on dashboard
    ↓
END
```

## API Response Pattern

```javascript
{
  "success": true/false,
  "data": {...} || [...],
  "error": "error message" // if success is false
  "pagination": { // if applicable
    "total": number,
    "page": number,
    "pages": number,
    "limit": number
  }
}
```

## Scalability Considerations

1. **Database**: Use MongoDB sharding for large datasets
2. **Caching**: Implement Redis for frequently accessed data
3. **Queue**: Use Bull for async scraping jobs
4. **API Rate Limiting**: Implement per-user rate limits
5. **Load Balancing**: Use nginx for multiple backend instances
6. **CDN**: Use CloudFlare or AWS CloudFront for frontend

## Security

- Environment variables for sensitive data
- CORS configuration
- Input validation and sanitization
- Error handling and logging
- HTTPS for production
- JWT/OAuth for authentication (to be implemented)
