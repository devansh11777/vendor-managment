@echo off
title LPU Kart Launcher
echo ========================================================
echo        Starting LPU Kart - Campus Vendor Hub
echo ========================================================
echo.
echo 1. Starting Backend Express Server on port 5000...
start cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 2 /nobreak >nul
echo 2. Starting Frontend React Client on port 5173...
start cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 3 /nobreak >nul
echo 3. Opening LPU Kart in your browser...
start http://localhost:5173
echo.
echo Both servers are running! You can keep this window open or close it.
pause
