@echo off
TITLE Academic Paper Recommender System
COLOR 0A

echo ===================================================
echo      ACADEMIC PAPER RECOMMENDER - LAUNCHER
echo ===================================================
echo.

:: 1. Check if Python virtual environment exists
if not exist "backend\venv" (
    echo [ERROR] Virtual environment not found. Please run setup first.
    pause
    exit
)

:: 2. Start the Backend (in a new minimized window)
echo [1/3] Starting AI Backend Server...
start /min "AI Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload"

:: 3. Wait a moment for backend to initialize
echo [2/3] Waiting for AI Engine to warm up...
timeout /t 5 /nobreak >nul

:: 4. Start the Frontend (in a new minimized window)
echo [3/3] Starting User Interface...
start /min "Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo      SYSTEM STARTED SUCCESSFULLY!
echo ===================================================
echo.
echo The app should open in your browser shortly.
echo If not, visit: http://localhost:5173
echo.
echo DO NOT CLOSE THIS WINDOW or the background servers will stop.
echo.
pause