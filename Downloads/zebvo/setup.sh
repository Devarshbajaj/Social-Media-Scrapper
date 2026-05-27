#!/bin/bash

# Social Media Scraper Dashboard - Setup Script

echo "🚀 Starting Social Media Scraper Dashboard Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check if MongoDB is installed or accessible
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Please ensure MongoDB is running (locally or on Atlas)"
fi

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp ../.env.example .env
    echo "⚠️  Please update .env with your API credentials"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with your API keys"
echo "2. Ensure MongoDB is running"
echo "3. Start backend:   cd backend && npm run dev"
echo "4. Start frontend:  cd frontend && npm run dev"
echo ""
echo "🌐 Access dashboard at http://localhost:3000"
