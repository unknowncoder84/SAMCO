# Deploy Frontend to Netlify - Step by Step

## Your Backend is Live! ✅
Backend URL: `https://samco-5f69.onrender.com`

## Step 1: Go to Netlify
1. Open https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"

## Step 2: Connect GitHub
1. Click "Deploy with GitHub"
2. Authorize Netlify to access your GitHub
3. Search for and select: `unknowncoder84/SAMCO`

## Step 3: Configure Build Settings
Netlify should auto-detect from `netlify.toml`, but verify:

- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/.next`

## Step 4: Add Environment Variable
This is CRITICAL - your frontend needs to know where the backend is!

Click "Add environment variables" or "Show advanced":
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://samco-5f69.onrender.com`

## Step 5: Deploy
1. Click "Deploy site"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://random-name-123.netlify.app`

## Step 6: Update Backend CORS
Once you have your Netlify URL, we need to update the backend to allow requests from it.

Your Netlify URL will be something like: `https://samco-bhavcopy.netlify.app`

We'll update the backend CORS settings to include this URL.

## Step 7: Test Your App
1. Open your Netlify URL
2. Select NSE F&O segment
3. Pick a date (try Feb 20, 2026)
4. Click "Download CSV"
5. File should download!

---

## Troubleshooting

### Build fails on Netlify
- Check build logs for errors
- Make sure Node version is 18 or higher
- Verify all dependencies are in package.json

### Frontend loads but can't connect to backend
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Make sure backend CORS includes your Netlify URL

### Backend returns 404
- Check that you're using `/api/` prefix in URLs
- Verify backend is still running on Render

---

## Next Steps After Deployment
1. Get your Netlify URL
2. Update backend CORS (I'll help with this)
3. Test the full flow
4. Optionally: Set up custom domain on Netlify
