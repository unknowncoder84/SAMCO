# 🚀 Deploy Now - Quick Reference

## 100% FREE Deployment (Netlify + Render)

### ⏱️ Total Time: 15-20 minutes

---

## Step 1: Deploy Backend to Render (10 min)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New +** → Web Service
4. **Select**: `unknowncoder84/SAMCO`
5. **Configure**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && playwright install chromium && playwright install-deps`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: **Free**
6. **Environment Variable**:
   - Key: `CORS_ORIGINS`
   - Value: `*`
7. **Create Web Service**
8. **Wait 5-10 minutes**
9. **Copy URL**: `https://samco-backend.onrender.com`

✅ Backend deployed!

---

## Step 2: Deploy Frontend to Netlify (5 min)

1. **Go to**: https://app.netlify.com
2. **Sign up** with GitHub
3. **Add new site** → Import from GitHub
4. **Select**: `unknowncoder84/SAMCO`
5. **Settings** (auto-detected from netlify.toml):
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/.next`
6. **Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://samco-backend.onrender.com` (your Render URL)
7. **Deploy site**
8. **Wait 3-5 minutes**
9. **Copy URL**: `https://your-site.netlify.app`

✅ Frontend deployed!

---

## Step 3: Update Backend CORS (2 min)

1. **Go to**: Render dashboard
2. **Click**: Your backend service
3. **Environment** → Edit `CORS_ORIGINS`
4. **Change to**: `https://your-site.netlify.app`
5. **Save** (auto-redeploys)

✅ CORS configured!

---

## Step 4: Test (2 min)

1. **Open**: Your Netlify URL
2. **Select**: Date (Feb 13, 2026)
3. **Select**: Segment (NSE F&O)
4. **Click**: Download CSV File
5. **Wait**: 30-60 seconds (first time - cold start)
6. **File downloads** ✅

---

## 🎉 Done!

**Your app is live and FREE!**

- Frontend: `https://your-site.netlify.app`
- Backend: `https://samco-backend.onrender.com`

---

## ⚠️ Important Notes

### Render Free Tier:
- Spins down after 15 min idle
- First request = 30-60 sec wait (cold start)
- Subsequent requests = fast

### To Keep Backend Awake:
- Use app regularly, OR
- Set up UptimeRobot (free) to ping every 5 min, OR
- Upgrade to Render Starter ($7/month)

---

## 🆘 Quick Troubleshooting

### Downloads fail?
- Check: `NEXT_PUBLIC_API_URL` in Netlify
- Check: Backend is running at `/api/health`

### CORS error?
- Update: `CORS_ORIGINS` in Render to Netlify URL
- Redeploy backend

### Slow response?
- Wait: 30-60 sec for cold start
- Then: Fast for next 15 minutes

---

## 📚 Full Guide

See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

**Cost**: $0/month

**Repository**: https://github.com/unknowncoder84/SAMCO

**Status**: ✅ Ready to Deploy
