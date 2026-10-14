@echo off
echo ==============================================
echo   Starting Student Study Planner (Full-Stack)
echo ==============================================
echo 1. Starting Backend API on http://localhost:5000 ...
start "SSP Backend" cmd /k "cd /d %~dp0backend && npm start"

echo 2. Starting Frontend on http://localhost:5173 ...
start "SSP Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ==============================================
echo   Services are running!
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo ==============================================
pause
