#!/bin/bash

# Script to restart the development server safely
# This kills any existing processes on port 7002 and starts fresh

echo "🔄 Restarting development server..."

# Kill any process using port 7002
echo "🛑 Stopping existing processes on port 7002..."
lsof -ti:7002 | xargs kill -9 2>/dev/null || echo "No process found on port 7002"

# Kill any npm dev processes
echo "🛑 Stopping npm development processes..."
ps aux | grep "npm run start:dev" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || echo "No npm processes found"

# Wait a moment for processes to fully terminate
sleep 2

# Start the development server
echo "🚀 Starting development server..."
npm run start:dev
