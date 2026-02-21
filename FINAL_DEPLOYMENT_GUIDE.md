# 🚀 Final Deployment Guide - Netlify + Render (FREE)

## ✅ You're Using: Next.js Frontend + FastAPI Backend

**Setup:**
- Frontend (Next.js) → Netlify (FREE)
- Backend (FastAPI + Playwright) → Render (FREE)

**Total Cost:** $0/month

**Note:** Render free tier has 30-60 second cold starts after 15 minutes of inactivity.

---

## 📋 Quick Deployment (15 minutes)

### Step 1: Deploy Backend to Render (10 min)

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **New +** → Web Service
4. **Select:** `unknowncoder84/SAMCO`
5. **Configure:**
   - Name: `samco-backend`
   - Root Directory: `backend`
   - Build Command: 
     ```
     pip install -r requirements.txt && playwright install chromium && playwright install-deps
     ```
   - Start Command:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - Instance Type: **Free**
6. **Environment Variable:**
   - Key: `CORS_ORIGINS`
   - Value: `*`
7. **Create Web Service**
8. **Wait 5-10 minutes**
9. **Copy URL:** `https://samco-backend.onrender.com`

✅ Backend deployed!

---

### Step 2: Deploy Frontend to Netlify (5 min)

1. **Go to:** https://app.netlify.com
2. **Sign up** with GitHub
3. **Add new site** → Import from GitHub
4. **Select:** `unknowncoder84/SAMCO`
5. **Settings** (auto-detected):
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/.next`
6. **Environment Variable:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://samco-backend.onrender.com` (your Render URL)
7. **Deploy site**
8. **Wait 3-5 minutes**
9. **Copy URL:** `https://your-site.netlify.app`

✅ Frontend deployed!

---

### Step 3: Update Backend CORS (2 min)

1. **Go to:** Render dashboard
2. **Click:** Your backend service
3. **Environment** → Edit `CORS_ORIGINS`
4. **Change to:** `https://your-site.netlify.app`
5. **Save** (auto-redeploys)

✅ CORS configured!

---

### Step 4: Test (2 min)

1. **Open:** Your Netlify URL
2. **Select:** Date (Feb 13, 2026)
3. **Select:** Segment (NSE F&O)
4. **Click:** Download CSV File
5. **Wait:** 30-60 seconds (first time - cold start)
6. **File downloads** ✅

---

## 🎉 Done!

Your app is now live at:
- **Frontend:** `https://your-site.netlify.app`
- **Backend:** `https://samco-backend.onrender.com`

**Cost:** $0/month

---

## ⚠️ Important: Cold Starts

**Render Free Tier:**
- Backend sleeps after 15 minutes of no activity
- First request after sleep = 30-60 seconds wait
- Subsequent requests = fast

**This is normal and expected on the free tier.**

---

## 🆘 Troubleshooting

### Downloads fail?
- Check `NEXT_PUBLIC_API_URL` in Netlify environment variables
- Visit `https://your-backend.onrender.com/api/health` to check if backend is running

### CORS error?
- Update `CORS_ORIGINS` in Render to your Netlify URL
- Redeploy backend

### Slow response?
- Wait 30-60 seconds for cold start
- Then fast for next 15 minutes

---

## 📚 Full Documentation

- **Detailed Guide:** `RENDER_DEPLOYMENT_GUIDE.md`
- **Repository:** https://github.com/unknowncoder84/SAMCO

---

**Status:** ✅ Ready to Deploy

**Last Updated:** February 21, 2026
