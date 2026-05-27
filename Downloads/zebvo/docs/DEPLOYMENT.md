# Deployment Guide

## Deploying to Production

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

#### Option 2: Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

#### Option 3: AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Backend Deployment

#### Option 1: Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

#### Option 2: AWS EC2
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone and setup
git clone your-repo
cd social-media-scraper-dashboard/backend
npm install
npm start
```

#### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Select `backend` directory
3. Set environment variables
4. Deploy

### Database Deployment

#### MongoDB Atlas
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to environment variables
4. Configure IP whitelist

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your_strong_secret_key

# API Keys
TWITTER_BEARER_TOKEN=xxx
REDDIT_CLIENT_ID=xxx
REDDIT_CLIENT_SECRET=xxx
YOUTUBE_API_KEY=xxx
GOOGLE_TRANSLATE_API_KEY=xxx

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

## CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          cd backend && npm install
          cd ../frontend && npm install && npm run build
      
      - name: Deploy
        run: |
          # Your deployment commands
```

## Domain Configuration

1. Purchase domain (GoDaddy, Namecheap, etc.)
2. Configure DNS:
   - Frontend: Point to CDN/hosting provider
   - Backend API: Create CNAME to backend server
3. Set up SSL certificates (Let's Encrypt)

## Monitoring

### Application Monitoring
- Use PM2 for process management
- Set up error tracking (Sentry)
- Monitor logs (ELK stack or CloudWatch)

### Performance Monitoring
- Use DataDog or New Relic
- Monitor API response times
- Track database queries

### Health Checks
- Regular endpoint monitoring
- Database connectivity checks
- Scraping job status tracking

## Backup & Recovery

```bash
# MongoDB Atlas automatic backups
# Enable in M10+ clusters

# Manual backup
mongodump --uri="mongodb+srv://..."
mongorestore --uri="mongodb+srv://..." dump/
```

## Scaling Considerations

1. **Horizontal Scaling**
   - Deploy multiple backend instances
   - Use load balancer (Nginx, HAProxy)
   
2. **Database Scaling**
   - Enable sharding in MongoDB Atlas
   - Implement read replicas
   
3. **Caching**
   - Add Redis for frequently accessed data
   - Cache API responses

4. **CDN**
   - Use CloudFlare or AWS CloudFront
   - Cache static assets

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] Input validation implemented
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Database credentials encrypted
- [ ] Regular security audits
- [ ] DDoS protection enabled
- [ ] Web Application Firewall (WAF)

## Troubleshooting

### Application not responding
- Check server logs
- Verify MongoDB connection
- Check API rate limits
- Review resource usage

### High latency
- Monitor database performance
- Check API response times
- Review backend logs
- Consider scaling

### Failed scraping jobs
- Check platform API status
- Verify API credentials
- Review error logs
- Check network connectivity
