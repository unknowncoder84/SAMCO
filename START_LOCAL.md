# 🚀 Quick Start - Run Locally

## ✅ Current Status: RUNNING!

Your SAMCO Bhavcopy Downloader is now running locally:

### 🔧 Backend (FastAPI)
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health
- **API Docs**: http://localhost:8000/docs
- **Status**: ✅ Running

### 🌐 Frontend (Next.js)
- **URL**: http://localhost:3000
- **Status**: ✅ Running

## 📖 How to Use

1. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

2. **Download CSV File**:
   - Select a date (e.g., Feb 20, 2026)
   - Choose segment (NSE F&O is default)
   - Click "Download CSV File"
   - File will download to your Downloads folder

3. **Convert CSV to Excel**:
   - Go to File Processor section
   - Upload a CSV file
   - Select columns to include
   - Choose PE/CE filters
   - Click "Convert to Excel"

## 🛑 Stop Servers

The servers are running in background processes. To stop them:

1. **In Kiro**: Use the process management tools
2. **Manually**: Press `Ctrl+C` in the terminal windows

## 🔄 Restart Servers

If you need to restart:

### Backend:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend:
```bash
cd frontend
npm run dev
```

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use**:
```bash
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

**Import errors**:
```bash
cd backend
pip install -r requirements.txt
playwright install chromium
```

### Frontend Issues

**Port 3000 already in use**:
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

**Module not found**:
```bash
cd frontend
rm -rf node_modules .next
npm install
```

## 📊 Test the System

### 1. Test Backend Health
Open: http://localhost:8000/api/health

Should return:
```json
{"status":"healthy"}
```

### 2. Test API Documentation
Open: http://localhost:8000/docs

You'll see interactive API documentation.

### 3. Test Frontend
Open: http://localhost:3000

You should see the SAMCO Bhavcopy Downloader interface.

### 4. Test Download
1. Select date: Feb 20, 2026
2. Select segment: NSE F&O
3. Click "Download CSV File"
4. Check your Downloads folder

## 🔍 View Logs

### Backend Logs
Check the terminal where backend is running for:
- API requests
- Download progress
- Errors

### Frontend Logs
- Browser console (F12)
- Terminal where frontend is running

## 💡 Development Tips

### Hot Reload
Both servers support hot reload:
- **Backend**: Changes to Python files auto-reload
- **Frontend**: Changes to React files auto-reload

### API Testing
Use the interactive docs at http://localhost:8000/docs to test API endpoints.

### Database (Optional)
If you want to enable history tracking:
1. Set up Supabase account
2. Add DATABASE_URL to backend/.env
3. Uncomment database code in backend/app/main.py

## 📝 Environment Variables

### Backend (.env in backend/)
```bash
# Optional - for CORS
CORS_ORIGINS=http://localhost:3000

# Optional - for database
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Frontend (.env.local in frontend/)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎯 Next Steps

1. **Test the download feature** with a recent trading date
2. **Try CSV to Excel conversion** with a downloaded file
3. **Explore the API docs** at http://localhost:8000/docs
4. **Check the code** to understand how it works
5. **Make changes** and see hot reload in action

## 🚀 Deploy to Production

When ready to deploy:
1. Read DEPLOYMENT.md for detailed guide
2. Follow DEPLOYMENT_CHECKLIST.md step by step
3. Backend deploys to Render
4. Frontend deploys to Netlify

---

**Enjoy using SAMCO Bhavcopy Downloader! 🎉**
