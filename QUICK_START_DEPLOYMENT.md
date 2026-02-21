# 🚀 Quick Start: Deploy to Netlify in 10 Minutes

## ✅ Prerequisites

- [x] Code pushed to GitHub: https://github.com/unknowncoder84/SAMCO
- [ ] Railway account (for backend)
- [ ] Netlify account (for frontend)

## 📋 Step-by-Step Deployment

### Step 1: Deploy Backend (5 minutes)

#### Go to Railway
1. Open https://railway.app
2. Click "Login" → Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `unknowncoder84/SAMCO`

#### Configure Backend
6. Railway will detect Python app
7. Click "Settings" → "Root Directory" → Set to `backend`
8. Click "Variables" → Add new variable:
   ```
   CORS_ORIGINS=*
   ```
9. Click "Deploy"
10. Wait 2-3 minutes for deployment
11. Copy your backend URL (e.g., `https://samco-production.up.railway.app`)

✅ Backend deployed!

---

### Step 2: Deploy Frontend (5 minutes)

#### Go to Netlify
1. Open https://app.netlify.com
2. Click "Sign up" or "Log in" → Use GitHub
3. Click "Add new site" → "Import an existing project"
4. Click "Deploy with GitHub"
5. Authorize Netlify if prompted
6. Select `unknowncoder84/SAMCO` repository

#### Configure Frontend
7. Netlify will auto-detect settings from `netlify.toml`
8. Verify settings:
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/.next`
9. Click "Add environment variables"
10. Add variable:
    ```
    Key: NEXT_PUBLIC_API_URL
    Value: <paste your Railway URL from Step 1>
    ```
11. Click "Deploy site"
12. Wait 3-5 minutes for build
13. Your site will be live at `https://random-name.netlify.app`

✅ Frontend deployed!

---

### Step 3: Update Backend CORS (1 minute)

1. Go back to Railway dashboard
2. Click on your project
3. Click "Variables"
4. Update `CORS_ORIGINS` to your Netlify URL:
   ```
   CORS_ORIGINS=https://your-site-name.netlify.app
   ```
5. Click "Redeploy"

✅ CORS configured!

---

### Step 4: Test Your Deployment (1 minute)

1. Open your Netlify URL
2. Select date: Feb 13, 2026 (or any recent trading day)
3. Select segment: NSE F&O
4. Click "Download CSV File"
5. File should download!

✅ System working!

---

## 🎉 You're Done!

Your SAMCO Bhavcopy Downloader is now live on the internet!

### Your URLs
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend**: `https://samco-production.up.railway.app`

### What You Can Do Now

1. **Download files** for any trading date
2. **Convert CSV to Excel** with filtering
3. **Share the URL** with others
4. **Set up custom domain** (optional)

---

## 🔧 Optional: Custom Domain

### On Netlify
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `samco.yourdomain.com`)
4. Follow DNS instructions
5. Netlify will auto-provision SSL

---

## 💰 Cost

### Free Tier (Good for Personal Use)
- **Netlify**: Free
  - 100 GB bandwidth/month
  - 300 build minutes/month
  
- **Railway**: $5 credit (free trial)
  - After trial: ~$5-10/month

### Total: ~$5-10/month after free trial

---

## 🆘 Troubleshooting

### Frontend loads but downloads fail

**Check:**
1. Is backend running? Visit `https://your-railway-url/api/health`
2. Is `NEXT_PUBLIC_API_URL` set correctly in Netlify?
3. Check browser console for errors (F12)

**Fix:**
- Verify environment variable in Netlify
- Redeploy frontend

### CORS errors in browser console

**Error**: "Access to fetch blocked by CORS policy"

**Fix:**
1. Go to Railway
2. Update `CORS_ORIGINS` to your Netlify URL
3. Redeploy backend

### Build fails on Netlify

**Check build logs:**
1. Go to Netlify dashboard
2. Click "Deploys"
3. Click on failed deploy
4. Read error message

**Common fixes:**
- Verify Node version is 18+
- Check all dependencies in package.json
- Ensure `netlify.toml` is in root directory

---

## 📊 Monitoring

### Check Backend Status
Visit: `https://your-railway-url/api/health`

Should return: `{"status":"healthy"}`

### Check Frontend
Visit: `https://your-netlify-url`

Should load the UI

### Check Logs

**Railway:**
- Dashboard → Your project → "Logs" tab

**Netlify:**
- Dashboard → Your site → "Deploys" → Click deploy → "Deploy log"

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
- Netlify automatically deploys on push
- Railway automatically deploys on push

No manual action needed! 🎉

---

## 📞 Need Help?

1. Check `NETLIFY_DEPLOYMENT.md` for detailed guide
2. Check `DEPLOYMENT_SUMMARY.md` for checklist
3. Review Railway/Netlify documentation
4. Check GitHub issues

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Netlify account created
- [ ] Frontend deployed to Netlify
- [ ] Environment variable set on Netlify
- [ ] CORS updated on Railway
- [ ] Test download works
- [ ] Celebrate! 🎉

---

**Time to Deploy**: ~10 minutes

**Difficulty**: Easy

**Cost**: ~$5-10/month (after free trial)

**Status**: ✅ Ready to Deploy

---

**Repository**: https://github.com/unknowncoder84/SAMCO

**Last Updated**: February 21, 2026
