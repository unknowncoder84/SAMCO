@echo off
echo ========================================
echo  SAMCO Bhavcopy Downloader - Local Start
echo ========================================
echo.

echo Starting Backend (FastAPI)...
start "SAMCO Backend" cmd /k "cd backend && uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo Starting Frontend (Next.js)...
start "SAMCO Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

echo.
echo Application opened in browser!
echo.
echo To stop the servers, close the terminal windows.
echo.
