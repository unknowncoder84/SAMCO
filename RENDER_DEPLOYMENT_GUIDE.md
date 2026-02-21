# 🚀 Deploy to Netlify + Render (100% FREE)

## Overview

This guide will help you deploy your SAMCO Bhavcopy Downloader completely FREE:
- **Frontend** → Netlify (FREE)
- **Backend** → Render Free Tier (FREE)

**Total Cost**: $0/month 🎉

## ⚠️ Important Notes About Render Free Tier

### What You Get (FREE):
- ✅ Unlimited apps
- ✅ Supports Python + Playwright
- ✅ 750 hours/month (enough for personal use)
- ✅ Automatic HTTPS

### Limitations:
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ **Cold start takes 30-60 seconds** (first request after spin-down)
- ⚠️ 512 MB RAM (enough for this app)

### What This Means:
- First download after 15 min idle = slow (30-60 sec wait)
- Subsequent downloads = fast
- Perfect for personal use
- Not ideal for high-traffic production

---

## 📋 Step-by-Step Deployment

### PART 1: Deploy Backend to Render (10 minutes)

#### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

#### Step 2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect account" if needed
4. Find and select `unknowncoder84/SAMCO` repository
5. Click "Connect"

#### Step 3: Configure Backend

Fill in the following settings:

**Basic Settings:**
- **Name**: `samco-backend` (or any name you like)
- **Region**: Choose closest to you (e.g., Singapore, Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**:
  ```bash
  pip install -r requirements.txt && playwright install chromium && playwright install-deps
  ```

- **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select **"Free"** (not "Starter")

#### Step 4: Add Environment Variables

Scroll down to "Environment Variables" section:

Click "Add Environment Variable" and add:

```
Key: CORS_ORIGINS
Value: *
```

(We'll update this later with your Netlify URL)

#### Step 5: Deploy Backend

1. Click "Create Web Service" at the bottom
2. Wait for deployment (5-10 minutes)
3. Watch the logs - you'll see:
   - Installing dependencies
   - Installing Playwright
   - Starting server
4. When you see "Application startup complete", it's ready!

#### Step 6: Copy Backend URL

1. At the top of the page, you'll see your service URL
2. It will look like: `https://samco-backend.onrender.com`
3. **Copy this URL** - you'll need it for Netlify

✅ Backend deployed!

---

### PART 2: Deploy Frontend to Netlify (5 minutes)

#### Step 1: Create Netlify Account

1. Go to https://app.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify

#### Step 2: Import Project

1. Click "Add new site" button
2. Select "Import an existing project"
3. Click "Deploy with GitHub"
4. Authorize Netlify if prompted
5. Search for and select `unknowncoder84/SAMCO`
6. Click on the repository

#### Step 3: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

**Build settings:**
- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/.next`

**Advanced build settings:**
- Click "Show advanced"
- Click "New variable"

Add environment variable:
```
Key: NEXT_PUBLIC_API_URL
Value: https://samco-backend.onrender.com
```
(Use YOUR Render URL from Part 1, Step 6)

#### Step 4: Deploy Frontend

1. Click "Deploy site" button
2. Wait 3-5 minutes for build
3. Watch the deploy log
4. When done, you'll see "Site is live"

#### Step 5: Copy Netlify URL

1. Your site will be at: `https://random-name-12345.netlify.app`
2. **Copy this URL**

✅ Frontend deployed!

---

### PART 3: Update Backend CORS (2 minutes)

Now we need to tell the backend to accept requests from your Netlify site.

#### Step 1: Go Back to Render

1. Go to https://dashboard.render.com
2. Click on your `samco-backend` service

#### Step 2: Update Environment Variable

1. Click "Environment" in the left sidebar
2. Find the `CORS_ORIGINS` variable
3. Click "Edit"
4. Change value from `*` to your Netlify URL:
   ```
   https://your-site-name.netlify.app
   ```
5. Click "Save Changes"

#### Step 3: Redeploy

1. Render will automatically redeploy
2. Wait 2-3 minutes
3. Check logs to confirm it's running

✅ CORS configured!

---

### PART 4: Test Your Deployment (2 minutes)

#### Step 1: Open Your Site

1. Go to your Netlify URL: `https://your-site-name.netlify.app`
2. The site should load

#### Step 2: Test Download

1. Select a date (e.g., Feb 13, 2026)
2. Select segment (NSE F&O)
3. Click "Download CSV File"

**First time (cold start):**
- ⏳ Wait 30-60 seconds (backend is waking up)
- You'll see "Downloading..." spinner
- File will download

**Subsequent downloads:**
- ⚡ Fast (2-5 seconds)
- Backend is already awake

#### Step 3: Test CSV to Excel

1. Upload a CSV file
2. Select columns
3. Click "Convert to Excel"
4. Should work instantly

✅ Everything working!

---

## 🎉 You're Done!

Your app is now live and 100% FREE!

**Your URLs:**
- Frontend: `https://your-site-name.netlify.app`
- Backend: `https://samco-backend.onrender.com`

---

## 🔧 Optional: Custom Domain

### On Netlify (Frontend)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `samco.yourdomain.com`)
4. Follow DNS instructions
5. Netlify will auto-provision SSL

### Update Backend CORS

After adding custom domain:
1. Go to Render → Environment
2. Update `CORS_ORIGINS` to your custom domain
3. Redeploy

---

## 📊 Understanding Render Free Tier

### How It Works:

```
User visits site
    ↓
First request after 15 min idle
    ↓
Backend wakes up (30-60 sec) ⏳
    ↓
Backend processes request
    ↓
File downloads ✅
    ↓
Backend stays awake for 15 min
    ↓
Next requests are fast ⚡
```

### Tips to Minimize Cold Starts:

1. **Use the app regularly** - Keeps backend awake
2. **Set up a ping service** - Free services like UptimeRobot can ping your backend every 5 minutes (keeps it awake)
3. **Upgrade to paid** - $7/month for always-on backend

---

## 🆘 Troubleshooting

### Frontend loads but downloads fail

**Check:**
1. Is backend URL correct in Netlify environment variables?
2. Is backend running? Visit `https://your-backend.onrender.com/api/health`
3. Check browser console (F12) for errors

**Fix:**
- Verify `NEXT_PUBLIC_API_URL` in Netlify
- Redeploy frontend

### "CORS policy" error

**Fix:**
1. Go to Render → Environment
2. Update `CORS_ORIGINS` to your Netlify URL
3. Redeploy backend

### Backend takes forever to respond

**Reason:** Cold start (backend was sleeping)

**Fix:**
- Wait 30-60 seconds for first request
- Subsequent requests will be fast
- Consider setting up UptimeRobot to keep it awake

### Build fails on Netlify

**Check build logs:**
1. Netlify dashboard → Deploys
2. Click failed deploy
3. Read error message

**Common fixes:**
- Verify Node version is 18+
- Check `netlify.toml` is in root directory
- Ensure all dependencies in `package.json`

### Build fails on Render

**Check deploy logs:**
1. Render dashboard → Your service
2. Click "Logs" tab
3. Read error message

**Common fixes:**
- Verify `requirements.txt` has all dependencies
- Check Python version (should be 3.11+)
- Ensure Playwright install command is correct

---

## 🔄 Making Updates

### Update Code

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main
```

### Auto-Deploy

- **Netlify**: Automatically deploys on push ✅
- **Render**: Automatically deploys on push ✅

No manual action needed!

---

## 💡 Upgrade to Paid (Optional)

If cold starts bother you, upgrade Render:

**Render Starter Plan: $7/month**
- ✅ No cold starts (always on)
- ✅ 512 MB RAM
- ✅ Fast response times

**How to upgrade:**
1. Render dashboard → Your service
2. Click "Upgrade" button
3. Select "Starter" plan
4. Add payment method

---

## 📞 Need Help?

1. Check Render logs: Dashboard → Your service → Logs
2. Check Netlify logs: Dashboard → Deploys → Deploy log
3. Check browser console: F12 → Console tab
4. Verify environment variables are set correctly

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Netlify account created
- [ ] Frontend deployed to Netlify
- [ ] Environment variable set on Netlify
- [ ] CORS updated on Render
- [ ] Test download works (waited for cold start)
- [ ] Test CSV to Excel works
- [ ] Celebrate! 🎉

---

**Total Cost**: $0/month

**Deployment Time**: ~15-20 minutes

**Status**: ✅ Ready to Deploy

**Repository**: https://github.com/unknowncoder84/SAMCO

---

**Last Updated**: February 21, 2026
