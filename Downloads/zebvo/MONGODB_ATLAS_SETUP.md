# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign up with Email"
3. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password
4. Click "Create your Atlas account"
5. Follow email verification

## Step 2: Create a Free Cluster
1. After login, click "Create Deployment"
2. Choose "Shared" (FREE tier) - this is enough for testing
3. Click "Create Shared Cluster"
4. Select region (choose closest to you)
5. Click "Create Deployment"
6. Wait 1-2 minutes for cluster creation

## Step 3: Add IP Address to Whitelist
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - In production, enter your specific IP
4. Click "Confirm"

## Step 4: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Fill in:
   - Username: `scraper` (or your choice)
   - Password: Create a strong password
   - Example: `SecurePass123!`
4. Click "Add User"

## Step 5: Get Connection String
1. Go to "Databases" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Drivers" → "Node.js"
4. Copy the connection string
5. Example format:
   ```
   mongodb+srv://scraper:<password>@cluster0.xxxxx.mongodb.net/social-media-scraper?retryWrites=true&w=majority
   ```

## Step 6: Replace Password in Connection String
- In the connection string, replace `<password>` with your actual password
- Example:
  ```
  mongodb+srv://scraper:SecurePass123!@cluster0.xxxxx.mongodb.net/social-media-scraper?retryWrites=true&w=majority
  ```

## Step 7: Update Backend .env
1. Open `backend/.env`
2. Replace this line:
   ```
   MONGODB_URI=mongodb://localhost:27017/social-media-scraper
   ```
   With your connection string:
   ```
   MONGODB_URI=mongodb+srv://scraper:SecurePass123!@cluster0.xxxxx.mongodb.net/social-media-scraper?retryWrites=true&w=majority
   ```

## Step 8: Restart Backend
1. Stop the backend server (Ctrl+C)
2. Run again:
   ```bash
   cd backend
   node src/server.js
   ```
3. Check console for: `✅ MongoDB connected successfully`

## Now Test the Application
1. Open browser: `http://localhost:5000`
2. Go to Settings page
3. Click "Start Scraping"
4. Check Dashboard for data!

---

## Quick Tips
- **Database name in URL**: `social-media-scraper` (will auto-create)
- **Free tier limits**: 512MB storage, 1M requests/month - plenty for testing
- **View data in MongoDB**: Go to "Databases" → "Browse Collections" in Atlas dashboard
- **Test connection**: Backend logs will show `✅ MongoDB connected successfully`

## Troubleshooting

### Connection Failed
- Check IP whitelist in "Network Access"
- Verify username and password
- Make sure database user is created

### Connection String Wrong
- Go to "Databases" → "Connect" → copy fresh connection string
- Replace `<password>` with actual password

### Still Not Working?
- Check backend logs for specific error
- Verify .env file is in `backend/` folder
- Make sure file is named exactly `.env` (not .env.txt)
