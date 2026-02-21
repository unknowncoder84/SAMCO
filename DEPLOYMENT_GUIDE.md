# Deployment Guide - Bhavcopy Pro with Supabase

## Overview

This guide will help you deploy the Bhavcopy Pro application with Supabase as the database backend.

## Architecture

```
Frontend (Next.js) → Vercel/Netlify
Backend (FastAPI) → Railway/Render/Fly.io
Database → Supabase (PostgreSQL)
```

---

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - Project Name: `bhavcopy-pro`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created (~2 minutes)

### 1.2 Get Connection Details

1. Go to Project Settings → Database
2. Copy these values:
   - `Host`
   - `Database name`
   - `Port`
   - `User`
   - `Password`
3. Connection string format:
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]
   ```

### 1.3 Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Downloads history table
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    segment VARCHAR(20) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT,
    row_count INTEGER,
    user_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed'
);

-- Processing history table
CREATE TABLE processing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    original_filename VARCHAR(255) NOT NULL,
    output_filename VARCHAR(255) NOT NULL,
    original_rows INTEGER,
    filtered_rows INTEGER,
    columns_selected TEXT[],
    include_pe BOOLEAN DEFAULT true,
    include_ce BOOLEAN DEFAULT true,
    user_id VARCHAR(255),
    processing_time_ms INTEGER
);

-- User settings table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    default_segment VARCHAR(20) DEFAULT 'NSE_FO',
    auto_download BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_downloads_date ON downloads(date);
CREATE INDEX idx_downloads_segment ON downloads(segment);
CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_processing_user ON processing_history(user_id);
CREATE INDEX idx_settings_user ON user_settings(user_id);
```

---

## Part 2: Backend Deployment

### 2.1 Add Supabase Dependencies

Add to `backend/requirements.txt`:
```
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
```

### 2.2 Create Database Module

Create `backend/app/database.py`:

```python
"""
Database connection and models for Supabase
"""
from sqlalchemy import create_engine, Column, String, Integer, BigInteger, Boolean, DateTime, Date, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import os
from datetime import datetime
import uuid

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Download(Base):
    __tablename__ = "downloads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    date = Column(Date, nullable=False)
    segment = Column(String(20), nullable=False)
    filename = Column(String(255), nullable=False)
    file_size = Column(BigInteger)
    row_count = Column(Integer)
    user_id = Column(String(255))
    status = Column(String(20), default="completed")

class ProcessingHistory(Base):
    __tablename__ = "processing_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    original_filename = Column(String(255), nullable=False)
    output_filename = Column(String(255), nullable=False)
    original_rows = Column(Integer)
    filtered_rows = Column(Integer)
    columns_selected = Column(ARRAY(String))
    include_pe = Column(Boolean, default=True)
    include_ce = Column(Boolean, default=True)
    user_id = Column(String(255))
    processing_time_ms = Column(Integer)

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), unique=True, nullable=False)
    default_segment = Column(String(20), default="NSE_FO")
    auto_download = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2.3 Deploy Backend

#### Option A: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://[your-supabase-connection-string]
   PORT=8000
   ```
5. Railway will auto-detect Python and deploy

#### Option B: Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   ```
   DATABASE_URL=postgresql://[your-supabase-connection-string]
   ```

---

## Part 3: Frontend Deployment

### 3.1 Update Environment Variables

Create `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### 3.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: Next.js
4. Root Directory: `frontend`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy

---

## Part 4: Testing Deployment

### 4.1 Test Backend

```bash
curl https://your-backend-url.railway.app/api/health
```

Expected response:
```json
{"status": "healthy"}
```

### 4.2 Test Frontend

1. Visit your Vercel URL
2. Try downloading a CSV file
3. Try converting CSV to Excel
4. Check Supabase dashboard for new records

---

## Part 5: Monitoring

### 5.1 Supabase Dashboard

- Go to Supabase → Table Editor
- View `downloads` and `processing_history` tables
- Monitor database usage

### 5.2 Backend Logs

- Railway: View logs in dashboard
- Render: View logs in dashboard

### 5.3 Frontend Logs

- Vercel: View function logs and analytics

---

## Environment Variables Summary

### Backend
```
DATABASE_URL=postgresql://user:password@host:port/database
PORT=8000
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

---

## Cost Estimates

### Free Tier Limits

- **Supabase**: 500 MB database, 2 GB bandwidth/month
- **Railway**: $5 credit/month (enough for small apps)
- **Vercel**: 100 GB bandwidth/month, unlimited deployments

### Paid Plans (if needed)

- **Supabase Pro**: $25/month (8 GB database, 50 GB bandwidth)
- **Railway**: Pay as you go (~$5-20/month for small apps)
- **Vercel Pro**: $20/month (1 TB bandwidth)

---

## Troubleshooting

### Database Connection Issues

1. Check DATABASE_URL format
2. Verify Supabase project is active
3. Check IP allowlist in Supabase (should allow all for serverless)

### CORS Issues

Add to `backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Build Failures

- Check Python version (use 3.11+)
- Verify all dependencies in requirements.txt
- Check build logs for specific errors

---

## Next Steps

1. Set up custom domain (optional)
2. Add authentication (Supabase Auth)
3. Set up automated backups
4. Configure monitoring alerts
5. Add rate limiting for API

---

## Support

For issues:
1. Check deployment logs
2. Verify environment variables
3. Test database connection
4. Check CORS settings

Need help? Create an issue in the repository.
