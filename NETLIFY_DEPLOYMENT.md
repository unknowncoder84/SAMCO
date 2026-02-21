# Netlify Deployment Guide

## Overview

This guide will help you deploy the SAMCO Bhavcopy Downloader frontend to Netlify.

## Important Note

⚠️ **The frontend alone won't work without the backend!**

The frontend is a Next.js application that makes API calls to the FastAPI backend. You need to:
1. Deploy the backend first (to Railway, Render, or another service)
2. Then deploy the frontend to Netlify with the backend URL

## Prerequisites

- GitHub account with the SAMCO repository
- Netlify account (free tier works)
- Backend deployed and accessible via HTTPS

## Step 1: Deploy Backend First

### Option A: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select the SAMCO repository
5. Railway will auto-detect the Python app
6. Set root directory to `backend`
7. Add environment variable:
   ```
   CORS_ORIGINS=https://your-netlify-url.netlify.app
   ```
8. Deploy and note the URL (e.g., `https://samco-backend.railway.app`)

### Option B: Render

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect the SAMCO repository
5. Configure:
   - Name: `samco-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && playwright install chromium`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable:
   ```
   CORS_ORIGINS=https://your-netlify-url.netlify.app
   ```
7. Deploy and note the URL

## Step 2: Deploy Frontend to Netlify

### Method 1: Netlify UI (Easiest)

1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select the `SAMCO` repository

3. **Configure Build Settings**
   
   Netlify should auto-detect the `netlify.toml` configuration, but verify:
   
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/.next`
   - **Node version**: 18 or higher

4. **Add Environment Variables**
   
   Go to Site settings → Environment variables → Add:
   
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   
   Replace with your actual backend URL from Step 1.

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at `https://random-name.netlify.app`

6. **Update Backend CORS**
   - Go back to your backend deployment (Railway/Render)
   - Update the `CORS_ORIGINS` environment variable with your Netlify URL
   - Redeploy the backend

### Method 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   cd frontend
   netlify init
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_API_URL https://your-backend-url.railway.app
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `samco.yourdomain.com`)
4. Follow DNS configuration instructions
5. Netlify will auto-provision SSL certificate

## Configuration Files

### netlify.toml

The repository includes a `netlify.toml` file with the following configuration:

```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

Required environment variables for the frontend:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://samco-backend.railway.app` |

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Check that all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Build exceeded time limit"**
- Solution: Upgrade to Netlify Pro or optimize build
- Check for large dependencies

### Site Loads But API Calls Fail

**Error: "CORS policy"**
- Solution: Update backend `CORS_ORIGINS` to include Netlify URL
- Redeploy backend after updating

**Error: "Network error"**
- Solution: Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running and accessible

### Downloads Don't Work

**Issue: Backend needs Playwright**
- Solution: Backend must be deployed to a service that supports Playwright
- Railway and Render support this
- Netlify Functions do NOT support Playwright (use separate backend)

## Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Netlify CDN    │  ← Frontend (Next.js)
│  (Static Site)  │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Railway/Render │  ← Backend (FastAPI + Playwright)
│  (Server)       │
└────────┬────────┘
         │
         │ Web Scraping
         ▼
┌─────────────────┐
│  Samco Website  │
└─────────────────┘
```

## Cost Estimate

### Free Tier (Suitable for Personal Use)

- **Netlify**: Free
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Automatic HTTPS

- **Railway**: $5/month credit (free trial)
  - After trial: ~$5-10/month depending on usage
  - 500 hours/month included

- **Render**: Free tier available
  - Spins down after 15 min inactivity
  - Slower cold starts

### Paid Tier (For Production)

- **Netlify Pro**: $19/month
  - 400 GB bandwidth
  - 1000 build minutes
  - Better support

- **Railway**: Pay as you go
  - ~$10-20/month for consistent usage

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Netlify
- [ ] Environment variables set correctly
- [ ] CORS configured on backend
- [ ] Test download functionality
- [ ] Test CSV to Excel conversion
- [ ] Check all pages load correctly
- [ ] Verify mobile responsiveness
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

## Monitoring

### Netlify Analytics

Enable in Site settings → Analytics to track:
- Page views
- Unique visitors
- Top pages
- Bandwidth usage

### Backend Monitoring

Use your backend provider's monitoring:
- **Railway**: Built-in metrics dashboard
- **Render**: Metrics and logs in dashboard

## Updates and Maintenance

### Automatic Deployments

Netlify automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Netlify automatically builds and deploys

### Manual Deployments

If you need to manually trigger a deployment:

1. Go to Netlify dashboard
2. Click "Trigger deploy" → "Deploy site"

## Support

If you encounter issues:

1. Check Netlify deploy logs
2. Check backend logs (Railway/Render dashboard)
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for errors

## Security Notes

- Never commit API keys or secrets to GitHub
- Use environment variables for all sensitive data
- Keep dependencies updated
- Enable HTTPS (Netlify does this automatically)
- Configure CORS properly on backend

---

**Deployment Status**: Ready for production ✅

**Last Updated**: February 21, 2026
