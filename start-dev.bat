@echo off
echo 🚀 Starting TravelLite Development Environment...
echo.

echo 🔧 Starting Backend Server...
start "TravelLite Backend" cmd /k "cd /d "D:\PROJECTS\Luggage System\backend" && node api-server.js"

timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Server...
start "TravelLite Frontend" cmd /k "cd /d "D:\PROJECTS\Luggage System\frontend" && npm run dev"

echo.
echo 📊 Development servers are starting...
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:5173
echo.
echo 💡 Two command windows have opened - one for backend, one for frontend
echo 💡 Close both windows or press Ctrl+C in each to stop the servers
echo.
echo ✅ Development environment ready!
pause
