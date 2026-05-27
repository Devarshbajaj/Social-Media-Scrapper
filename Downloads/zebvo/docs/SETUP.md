# Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- API keys for social media platforms (optional, for full functionality)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp ../.env.example .env
```

Edit `.env` and add your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-scraper

# API Keys (Get from respective platforms)
TWITTER_BEARER_TOKEN=your_token
REDDIT_CLIENT_ID=your_id
REDDIT_CLIENT_SECRET=your_secret
YOUTUBE_API_KEY=your_key
GOOGLE_TRANSLATE_API_KEY=your_key
```

### 3. Start MongoDB
```bash
# On Windows
mongod

# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 4. Start Backend Server
```bash
npm run dev
```

Server will run on: `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API URL (Optional)
Create a `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Social Media Scraper Dashboard
```

### 3. Start Development Server
```bash
npm run dev
```

Dashboard will run on: `http://localhost:3000`

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Database Setup

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### Local MongoDB
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer, MongoDB will start as service
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` format
- Verify network access if using MongoDB Atlas

### Dependencies Issues
```bash
rm -rf node_modules
npm install
```

## Getting API Keys

### Twitter/X
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create an application
3. Generate API keys and tokens
4. Use Bearer Token in `.env`

### Reddit
1. Create app at https://www.reddit.com/prefs/apps
2. Get Client ID and Secret
3. Add to `.env`

### YouTube
1. Go to https://console.cloud.google.com
2. Enable YouTube Data API
3. Create API key
4. Add to `.env`

### Google Translate
1. Go to https://cloud.google.com/translate
2. Enable Translate API
3. Create API key
4. Add to `.env`

## Next Steps
- Configure API keys for desired platforms
- Run scraper to collect data
- View posts on dashboard
- Generate reports and export data
