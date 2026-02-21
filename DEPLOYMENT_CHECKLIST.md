# Deployment Checklist

Use this checklist to deploy the SAMCO Bhavcopy Downloader to production.

## ✅ Pre-Deployment

- [x] Code cleaned up (test files removed)
- [x] Configuration files verified
- [x] CORS supports environment variables
- [x] All changes committed to Git
- [x] Repository pushed to GitHub

## 🔧 Backend Deployment (Render)

### Current Status: ✅ DEPLOYED
- **URL**: https://samco-5f69.onrender.com
- **Status**: Live and working

### If Redeploying:

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Select Service**
   - Click on "samco-5f69" (or your service name)

3. **Trigger Manual Deploy**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait 5-10 minutes for build

4. **Add Environment Variable** (after frontend is deployed)
   ```
   CORS_ORIGINS=https://your-frontend.netlify.app
   ```

5. **Verify Deployment**
   ```bash
   curl https://samco-5f69.onrender.com/api/health
   ```
   Should return: `{"status":"healthy"}`

## 🌐 Frontend Deployment (Netlify)

### Current Status: ⏳ PENDING

### Steps:

1. **Go to Netlify Dashboard**
   - https://app.netlify.com

2. **Find Your Site**
   - Look for "SAMCO" or your site name

3. **Trigger Deploy**
   - Click "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

4. **Monitor Build**
   - Watch build logs for errors
   - Build should complete in 3-5 minutes

5. **Get Frontend URL**
   - Note the URL: `https://your-site.netlify.app`

6. **Update Backend CORS**
   - Go back to Render
   - Add environment variable:
     ```
     CORS_ORIGINS=https://your-site.netlify.app,http://localhost:3000
     ```
   - Save and redeploy backend

## 🧪 Post-Deployment Testing

### 1. Test Backend Health
```bash
curl https://samco-5f69.onrender.com/api/health
```
Expected: `{"status":"healthy"}`

### 2. Test Frontend
- Open: `https://your-site.netlify.app`
- Should load without errors

### 3. Test Full Flow
1. Select a recent trading date (e.g., Feb 20, 2026)
2. Choose "NSE F&O" segment
3. Click "Download CSV File"
4. Verify file downloads successfully
5. Check file size (should be ~5MB for NSE F&O)

### 4. Test CSV to Excel
1. Upload a CSV file
2. Select columns
3. Apply PE/CE filters
4. Download Excel
5. Verify Excel file opens correctly

## 🐛 Troubleshooting

### Backend Issues

**Build Fails**
- Check Render build logs
- Verify Dockerfile syntax
- Ensure all dependencies in requirements.txt

**Playwright Errors**
- Check system dependencies in Dockerfile
- Verify `playwright install chromium` runs
- May need to upgrade Render instance (more memory)

**CORS Errors**
- Verify CORS_ORIGINS environment variable
- Check frontend URL is correct (no trailing slash)
- Ensure backend redeployed after adding variable

### Frontend Issues

**Build Fails**
- Check Netlify build logs
- Verify Node version is 20
- Check tsconfig.json and next.config.js

**Module Not Found**
- Verify lib/ folder is in Git
- Check all imports use `@/` prefix
- Ensure tsconfig.json paths are correct

**API Calls Fail**
- Verify NEXT_PUBLIC_API_URL in netlify.toml
- Check backend is running
- Test backend health endpoint
- Check browser console for CORS errors

**Blank Page**
- Check browser console for errors
- Verify all environment variables set
- Check Netlify function logs

## 📊 Monitoring

### Backend (Render)
- Dashboard: https://dashboard.render.com
- Logs: Click service → "Logs" tab
- Metrics: Click service → "Metrics" tab

### Frontend (Netlify)
- Dashboard: https://app.netlify.com
- Logs: Click site → "Deploys" → Select deploy → "Deploy log"
- Analytics: Click site → "Analytics" tab (if enabled)

## 🔄 Continuous Deployment

Both platforms auto-deploy on Git push:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Netlify and Render will auto-deploy
```

## 📝 Environment Variables

### Backend (Render)
```bash
CORS_ORIGINS=https://your-frontend.netlify.app,http://localhost:3000
```

### Frontend (Netlify)
Already set in `netlify.toml`:
```bash
NEXT_PUBLIC_API_URL=https://samco-5f69.onrender.com
```

## ✨ Success Criteria

- [ ] Backend health endpoint returns 200
- [ ] Frontend loads without errors
- [ ] Can select date and segment
- [ ] CSV download works
- [ ] File size is correct (not 0 bytes)
- [ ] CSV to Excel conversion works
- [ ] No CORS errors in browser console
- [ ] No errors in backend logs
- [ ] No errors in frontend logs

## 🎉 Deployment Complete!

Once all checks pass:
1. Share the frontend URL with users
2. Monitor logs for first few hours
3. Test with real trading data
4. Celebrate! 🎊

---

**Need Help?**
- Check DEPLOYMENT.md for detailed guide
- Review platform documentation
- Check GitHub issues
- Contact platform support
