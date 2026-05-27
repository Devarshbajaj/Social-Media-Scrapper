# QUICKSTART.md

## 🚀 Quick Start Guide - Social Media Scraper Dashboard

This project contains a complete full-stack application ready to deploy.

## ⚡ Fastest Setup (5 minutes)

### Option 1: Using Setup Scripts

#### Windows:
```bash
setup.bat
```

#### macOS/Linux:
```bash
bash setup.sh
```

### Option 2: Manual Setup

1. **Install Dependencies**
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start MongoDB**
```bash
mongod
```

4. **Start Services** (in separate terminals)
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

5. **Open Dashboard**
```
http://localhost:3000
```

## 🐳 Using Docker (1 command!)

```bash
docker-compose up
```

Then visit `http://localhost:3000`

## 📋 Checklist Before Running

- [ ] Node.js v16+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] .env file created and configured
- [ ] Internet connection (for API calls)

## 🎯 First Steps

1. Go to Settings page
2. Select platforms to scrape
3. Click "Start Scraping"
4. Wait for job to complete
5. View posts on Dashboard

## 🔑 Getting API Keys (Optional)

### Twitter/X
- https://developer.twitter.com/

### Reddit
- https://www.reddit.com/prefs/apps

### YouTube
- https://console.cloud.google.com

### Google Translate
- https://cloud.google.com/translate

## 📖 Full Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## ❓ Troubleshooting

### Port 5000 already in use
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
```

### MongoDB connection failed
- Ensure `mongod` is running
- Check MONGODB_URI in .env

### Dependencies issue
```bash
rm -rf node_modules
npm install
```

## 🆘 Need Help?

- Check [docs/](docs/) folder
- Review terminal error messages
- Check browser console for frontend errors

---

**Ready to go?** Run your setup script or `docker-compose up` and start building!
