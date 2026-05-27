@echo off
REM Social Media Scraper Dashboard - Setup Script for Windows

echo 🚀 Starting Social Media Scraper Dashboard Setup...

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

REM Create .env if not exists
if not exist ".env" (
    echo Creating .env file from template...
    copy ..\\.env.example .env
    echo ⚠️  Please update .env with your API credentials
)

cd ..

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Update backend\.env with your API keys
echo 2. Ensure MongoDB is running
echo 3. Start backend:   cd backend ^&^& npm run dev
echo 4. Start frontend:  cd frontend ^&^& npm run dev
echo.
echo 🌐 Access dashboard at http://localhost:3000
