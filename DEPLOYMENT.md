# Deployment Guide

This guide covers deploying the SAMCO Bhavcopy Downloader to production.

## Architecture

- **Frontend**: Next.js 14 app deployed on Netlify
- **Backend**: FastAPI + Playwright deployed on Render
- **Database**: Optional (Supabase for history tracking)

## Backend Deployment (Render)

### Prerequisites
- GitHub account with repository
- Render account (free tier available)

### Steps

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `SAMCO` repository

3. **Configure Service**
   - **Name**: `samco-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Instance Type**: Free (or paid for better performance)

4. **Environment Variables** (Optional)
   ```
   CORS_ORIGINS=https://your-frontend-url.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)
   - Note your backend URL: `https://your-service.onrender.com`

### Verify Backend
```bash
curl https://your-service.onrender.com/api/health
# Should return: {"status":"healthy"}
```

## Frontend Deployment (Netlify)

### Prerequisites
- GitHub account with repository
- Netlify account (free tier available)

### Steps

1. **Update Backend URL**
   
   Edit `netlify.toml`:
   ```toml
   [build.environment]
     NEXT_PUBLIC_API_URL = "https://your-backend.onrender.com"
   ```

2. **Push changes**
   ```bash
   git add netlify.toml
   git commit -m "Update backend URL for production"
   git push origin main
   ```

3. **Create New Site on Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your `SAMCO` repository

4. **Configure Build Settings**
   
   Netlify will auto-detect settings from `netlify.toml`:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/.next`
   - **Node version**: `20`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build (3-5 minutes)
   - Note your frontend URL: `https://your-site.netlify.app`

### Update Backend CORS

After frontend is deployed, update backend CORS:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add environment variable:
   ```
   CORS_ORIGINS=https://your-site.netlify.app
   ```
5. Save and redeploy

## Post-Deployment

### Test the Application

1. **Open frontend URL** in browser
2. **Select a date** (recent trading day)
3. **Choose segment** (NSE F&O)
4. **Click "Download CSV"**
5. **Verify file downloads** successfully

### Monitor Logs

**Backend (Render)**:
- Go to service dashboard
- Click "Logs" tab
- Monitor for errors

**Frontend (Netlify)**:
- Go to site dashboard
- Click "Deploys" tab
- Check build logs

## Troubleshooting

### Backend Issues

**Build fails**:
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check Render build logs

**Playwright errors**:
- Ensure Dockerfile installs system dependencies
- Verify `playwright install chromium` runs
- Check memory limits (upgrade instance if needed)

**CORS errors**:
- Verify CORS_ORIGINS environment variable
- Check frontend URL is correct
- Ensure no trailing slash in URL

### Frontend Issues

**Build fails**:
- Check Node version (should be 20)
- Verify all dependencies in package.json
- Check Netlify build logs

**Module not found**:
- Verify tsconfig.json paths are correct
- Check all imports use `@/` prefix
- Ensure lib/ folder is committed to Git

**API calls fail**:
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend is running
- Test backend health endpoint

## Scaling

### Backend Scaling

**Render**:
- Upgrade to paid plan for:
  - More memory (Playwright needs 1GB+)
  - Faster CPU
  - No cold starts
  - Custom domains

**Alternative Platforms**:
- Railway (easy Python deployment)
- DigitalOcean App Platform
- AWS ECS/Fargate
- Google Cloud Run

### Frontend Scaling

Netlify free tier handles:
- 100GB bandwidth/month
- Unlimited sites
- Automatic CDN
- HTTPS included

For more:
- Upgrade to Pro plan
- Use custom domain
- Enable analytics

## Custom Domain

### Frontend (Netlify)

1. Go to site settings
2. Click "Domain management"
3. Click "Add custom domain"
4. Follow DNS configuration steps

### Backend (Render)

1. Upgrade to paid plan
2. Go to service settings
3. Click "Custom domain"
4. Add your domain
5. Configure DNS

## Environment Variables

### Backend

```bash
# Optional - for CORS
CORS_ORIGINS=https://your-frontend.com

# Optional - for database
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Frontend

```bash
# Required - backend API URL
NEXT_PUBLIC_API_URL=https://your-backend.com
```

## Continuous Deployment

Both Netlify and Render support automatic deployments:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Automatic Build**
   - Netlify rebuilds frontend
   - Render rebuilds backend

3. **Zero Downtime**
   - New version goes live automatically
   - Old version stays up during build

## Backup and Recovery

### Code Backup
- GitHub repository (primary)
- Local clones (secondary)

### Data Backup
- If using database, enable automatic backups
- Export important data regularly

### Rollback
- Netlify: Click "Deploys" → Select previous deploy → "Publish deploy"
- Render: Click "Manual Deploy" → Select previous commit

## Security

### Best Practices

1. **Environment Variables**
   - Never commit secrets to Git
   - Use platform environment variables
   - Rotate keys regularly

2. **CORS**
   - Only allow your frontend domain
   - Don't use wildcard (*) in production

3. **HTTPS**
   - Both platforms provide free SSL
   - Enforce HTTPS redirects

4. **Rate Limiting**
   - Consider adding rate limiting to API
   - Prevent abuse and excessive usage

## Cost Estimation

### Free Tier (Both Platforms)

**Render Free**:
- 750 hours/month
- Spins down after 15 min inactivity
- Cold start delay (~30 seconds)

**Netlify Free**:
- 100GB bandwidth
- 300 build minutes
- Unlimited sites

### Paid Plans

**Render Starter ($7/month)**:
- No cold starts
- Always on
- Better performance

**Netlify Pro ($19/month)**:
- 400GB bandwidth
- Priority support
- Advanced features

## Support

For deployment issues:
- Check platform documentation
- Review build logs
- Open GitHub issue
- Contact platform support

---

**Deployment Status**: ✅ Backend live on Render | ⏳ Frontend deploying to Netlify
