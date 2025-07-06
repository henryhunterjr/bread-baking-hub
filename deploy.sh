#!/bin/bash

# Bread Troubleshooting Pro - Deployment Script
# This script builds and deploys the application

set -e  # Exit on any error

echo "🍞 Starting Bread Troubleshooting Pro deployment..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test

# Build the application
echo "🏗️  Building application..."
npm run build

# Check build output
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# For Lovable deployment, the built files are automatically deployed
# For custom deployment, uncomment and configure the following:

# Option 1: Deploy to Vercel
# echo "🚀 Deploying to Vercel..."
# npx vercel --prod

# Option 2: Deploy to Netlify
# echo "🚀 Deploying to Netlify..."
# npx netlify deploy --prod --dir=dist

# Option 3: Deploy to custom server via rsync
# echo "🚀 Deploying to server..."
# rsync -avz --delete dist/ user@your-server:/path/to/web/root/

# Option 4: Start preview server (for testing)
echo "🌐 Starting preview server..."
echo "Preview will be available at http://localhost:4173"
echo "Press Ctrl+C to stop the server"
npm run preview

echo "🎉 Deployment completed successfully!"