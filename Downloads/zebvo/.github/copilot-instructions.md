# Social Media Scraper Dashboard - Development Guide

## Overview
Full-stack application for aggregating and processing social media content about passports using NLP, translation, and clustering.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB + NLP libraries
- **NLP**: Natural.js, Sentiment, Compromise
- **APIs**: Twitter/X, Reddit, YouTube, Google Translate

## Quick Commands

### Backend
```bash
cd backend
npm install
npm run dev              # Development with hot reload
npm start               # Production
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # Development server
npm run build           # Build for production
```

### Database
```bash
mongod                  # Start MongoDB locally
# OR use MongoDB Atlas
```

## Project Structure

### Backend: `backend/src/`
- `server.js` - Express app setup
- `config/` - Database, environment config
- `models/` - Mongoose schemas (Post, PostCluster, ScrapingJob)
- `routes/` - API endpoints (posts, clusters, scraper, export)
- `controllers/` - Request handlers
- `services/` - NLP, Translation, Clustering, Scraping business logic
- `scrapers/` - Platform-specific scrapers
- `nlp/` - Text analysis utilities

### Frontend: `frontend/src/`
- `App.jsx` - Main routing component
- `pages/` - Dashboard, Posts, Clusters, Statistics, Settings
- `components/` - Reusable UI components
- `services/` - API client (Axios)
- `context/` - Zustand state management
- `styles/` - Tailwind CSS configuration

## Architecture

```
Frontend (React) ← HTTP → Backend (Express) ← MongoDB
                           ↓
                    Scrapers & NLP Services
```

## Key Features

1. **Scraping**: TwitterScraper, RedditScraper, YouTubeScraper
2. **NLP**: Categorization, Sentiment, Gibberish detection, Summaries
3. **Translation**: Multi-language support (10+ languages)
4. **Clustering**: Similarity-based post grouping
5. **Filtering**: By platform, category, sentiment, engagement
6. **Export**: CSV, JSON formats

## API Endpoints

- `POST /api/scraper/start` - Start scraping job
- `GET /api/posts` - Get posts with filters
- `GET /api/clusters` - Get clustered posts
- `GET /api/export/csv` - Export to CSV
- See [API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) for full list

## Development Tips

- Use `.env.example` as template
- API Base URL: `http://localhost:5000`
- Frontend URL: `http://localhost:3000`
- Ensure MongoDB is running before starting backend
- Check browser console for frontend errors
- Check terminal for backend logs

## Common Issues

- **MongoDB Error**: Ensure MongoDB is running (`mongod` or MongoDB Atlas connected)
- **Port in Use**: Change PORT in .env or kill process:
  - macOS/Linux: `lsof -ti:5000 | xargs kill -9`
  - Windows: `netstat -ano | findstr :5000`
- **Dependencies**: `rm -rf node_modules && npm install`

## Next Steps

1. Install dependencies for both backend and frontend
2. Configure `.env` with API keys
3. Start MongoDB
4. Run `npm run dev` in both directories
5. Open http://localhost:3000 in browser
6. Start scraping from Settings page
