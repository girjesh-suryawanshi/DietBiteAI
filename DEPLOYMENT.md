# FitBite Deployment Guide - Quick Setup

## Current Issues Fixed
✅ React hooks error in Dashboard
✅ Meal plan generation working
✅ PDF generation working
✅ Build configuration ready

## Option 1: Deploy to Vercel (Easiest)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code

### Steps:

1. **Prepare for Vercel deployment:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Build the client
   npm run build:client
   ```

2. **Set up environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Add these environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
     VITE_FIREBASE_APP_ID=your_firebase_app_id
     DATABASE_URL=your_neon_database_url
     ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Configure Firebase:**
   - Add your Vercel domain to Firebase authorized domains
   - Update Firebase config with production URLs

### Vercel Configuration (vercel.json is already created)

## Option 2: Deploy to Hostinger

### Prerequisites
- Hostinger hosting account with Node.js support
- cPanel or file manager access

### Steps:

1. **Prepare the build:**
   ```bash
   # Build the client
   npm run build:client
   
   # Create production package
   cp package-production.json package.json
   npm install --production
   ```

2. **Upload files:**
   - Upload the entire project to your hosting directory
   - Make sure `client/dist/` folder is uploaded
   - Upload `server/` folder
   - Upload `node_modules/` (or run `npm install` on server)

3. **Set up environment variables:**
   Create a `.env` file in your root directory:
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   DATABASE_URL=your_neon_database_url
   PORT=3000
   ```

4. **Configure Node.js app:**
   - Set entry point to: `server/index.js`
   - Set startup file: `node server/index.js`
   - Configure port (usually 3000 or as specified by hosting)

5. **Configure domain:**
   - Point your domain to the Node.js app
   - Update Firebase authorized domains
   - Update any hardcoded URLs

## Option 3: Traditional Server Deployment

### For VPS/Dedicated Server:

1. **Server setup:**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy application:**
   ```bash
   # Clone your repository
   git clone your-repo-url
   cd fitbite
   
   # Install dependencies
   npm install
   
   # Build client
   npm run build:client
   
   # Start with PM2
   pm2 start server/index.js --name "fitbite"
   pm2 startup
   pm2 save
   ```

3. **Configure reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Setup

### For all deployment options:

1. **Create Neon Database:**
   - Sign up at neon.tech
   - Create a new database
   - Get the connection string

2. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

## API Keys Required

1. **Gemini AI API Key:**
   - Go to Google AI Studio
   - Create API key
   - Add to environment variables

2. **Firebase Config:**
   - Create Firebase project
   - Enable Authentication
   - Get config values
   - Add authorized domains

## Security Checklist

- [ ] All API keys are in environment variables
- [ ] Firebase authorized domains updated
- [ ] HTTPS enabled in production
- [ ] Database connection secured
- [ ] CORS configured properly
- [ ] Rate limiting implemented (if needed)

## Troubleshooting

### Common Issues:

1. **Build errors:**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check environment variables

2. **Firebase authentication errors:**
   - Verify authorized domains
   - Check API keys
   - Ensure HTTPS in production

3. **Database connection issues:**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Confirm database permissions

4. **API errors:**
   - Check Gemini API key
   - Verify API quotas
   - Check server logs

### Logs and Monitoring:

- **Vercel:** Check function logs in Vercel dashboard
- **Hostinger:** Check error logs in cPanel
- **PM2:** Use `pm2 logs fitbite` for server logs

## Performance Optimization

1. **Client-side:**
   - Enable gzip compression
   - Optimize images
   - Implement caching headers

2. **Server-side:**
   - Use CDN for static assets
   - Implement Redis caching
   - Database query optimization
   - Rate limiting

## Scaling Considerations

- Use serverless functions (Vercel) for automatic scaling
- Implement database connection pooling
- Consider CDN for global distribution
- Monitor API usage and costs