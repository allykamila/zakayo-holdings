#!/bin/bash

# This is a build script for Netlify deployment
echo "🚀 Starting Zakayo Holdings build process"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Success message
echo "✅ Build completed successfully! Ready for Netlify deployment."
