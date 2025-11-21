#!/bin/bash

# Chat Spy - Quick Deployment Script
# This script helps you deploy all parts of the application

echo "🚀 Chat Spy Deployment Helper"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "⚠️  Git repository not initialized!"
    echo "Run: git init"
    echo "Then: git add ."
    echo "Then: git commit -m 'Initial commit'"
    echo "Then: Create a GitHub repository and push"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes!"
    echo "Commit them before deploying:"
    echo "  git add ."
    echo "  git commit -m 'Your message'"
    echo "  git push"
    exit 1
fi

echo "✅ No uncommitted changes"
echo ""

echo "📋 Deployment Checklist:"
echo ""
echo "1. Server (Render.com)"
echo "   - Go to: https://render.com"
echo "   - Create Web Service"
echo "   - Root Directory: server"
echo "   - Build: npm install"
echo "   - Start: npm start"
echo "   - Save the URL!"
echo ""

echo "2. Client (Vercel)"
echo "   - Go to: https://vercel.com"
echo "   - Import project"
echo "   - Root Directory: client"
echo "   - Add env var: VITE_SERVER_URL = <your-render-url>"
echo "   - Deploy"
echo ""

echo "3. Landing (Vercel)"
echo "   - Same repository, different project"
echo "   - Root Directory: landing"
echo "   - Deploy"
echo ""

echo "4. Update Server CORS"
echo "   - In Render, add env var:"
echo "   - CORS_ORIGIN = <client-url>,<landing-url>"
echo ""

echo "📖 Full guide: See DEPLOYMENT.md"
echo ""
echo "Ready to deploy? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Opening deployment guides..."
    
    # Open Render
    echo "Opening Render.com..."
    open "https://render.com" 2>/dev/null || xdg-open "https://render.com" 2>/dev/null
    
    sleep 2
    
    # Open Vercel
    echo "Opening Vercel.com..."
    open "https://vercel.com" 2>/dev/null || xdg-open "https://vercel.com" 2>/dev/null
    
    echo ""
    echo "✅ Deployment sites opened!"
    echo "Follow the steps in DEPLOYMENT.md"
else
    echo "Deployment cancelled."
fi
