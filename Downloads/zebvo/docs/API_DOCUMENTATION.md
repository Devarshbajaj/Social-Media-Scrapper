# Social Media Scraper Dashboard - API Documentation

## Base URL
```
http://localhost:5000/api
```

## API Endpoints

### Posts

#### Get All Posts
```
GET /posts
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - platform: string (twitter|facebook|instagram|linkedin|youtube|reddit|tiktok)
  - category: string
  - sentiment: string (positive|negative|neutral)
  - sortBy: string (default: publishedAt)
  - order: number (-1 for desc, 1 for asc)
  - search: string
  - excludeGibberish: boolean (default: true)

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 5,
    "limit": 20
  }
}
```

#### Search Posts
```
GET /posts/search?q=passport
Query Parameters:
  - q: string (required)
  - page: number
  - limit: number

Response:
{
  "success": true,
  "data": [...],
  "query": "passport",
  "pagination": {...}
}
```

#### Get Posts by Platform
```
GET /posts/platform/{platform}
```

#### Get Posts by Category
```
GET /posts/category/{category}
```

#### Get Statistics
```
GET /posts/statistics

Response:
{
  "success": true,
  "data": {
    "totalPosts": 1000,
    "validPosts": 950,
    "gibberishPosts": 50,
    "byPlatform": {...},
    "byCategory": {...},
    "bySentiment": {...}
  }
}
```

#### Get Trending Posts
```
GET /posts/trending?limit=10
```

### Clusters

#### Get All Clusters
```
GET /clusters
Query Parameters:
  - page: number
  - limit: number
  - trending: boolean
  - category: string
```

#### Get Trending Clusters
```
GET /clusters/trending?limit=10
```

#### Get Clusters by Category
```
GET /clusters/category/{category}
```

#### Trigger Clustering
```
POST /clusters/trigger

Response:
{
  "success": true,
  "message": "Created X clusters",
  "clusters": [...]
}
```

### Scraper

#### Start Scraping Job
```
POST /scraper/start

Body:
{
  "platforms": ["twitter", "reddit", "youtube"]
}

Response:
{
  "success": true,
  "message": "Scraping job started",
  "jobId": "uuid"
}
```

#### Get Job Status
```
GET /scraper/job/{jobId}

Response:
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "completed|running|pending|failed",
    "postsCollected": 150,
    "summary": {...}
  }
}
```

#### Get Scraping History
```
GET /scraper/history?limit=20&page=1
```

### Export

#### Export to CSV
```
GET /export/csv?platform=twitter&category=Application

Query Parameters:
  - platform: string
  - category: string
  - sentiment: string
  - excludeGibberish: boolean
```

#### Export to JSON
```
GET /export/json?platform=twitter
```

#### Generate Report
```
GET /export/report

Response:
{
  "success": true,
  "data": {
    "summary": {...},
    "topCategories": [...],
    "topPlatforms": [...],
    "sentimentBreakdown": {...}
  }
}
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Status Codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
