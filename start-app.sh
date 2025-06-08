#!/bin/bash

echo "🚀 Starting NutriConnect Complete Application..."
echo "================================================"

# Stop any existing processes
pkill -f "next-server" 2>/dev/null || true
pkill -f "node.*server" 2>/dev/null || true

# Start backend API server on port 3000
echo "📡 Starting Backend API Server..."
cd /home/bhavani/Nutriconnect/New
node final-server.js &
BACKEND_PID=$!

sleep 3

# Start Next.js frontend on port 3002 with network access
echo "🖥️ Starting Frontend Application..."
HOST=0.0.0.0 PORT=3002 npm run dev &
FRONTEND_PID=$!

sleep 5

echo ""
echo "✅ NutriConnect Application Started Successfully!"
echo "================================================"
echo ""
echo "🌐 FRONTEND (End User Interface):"
echo "   Network: http://10.26.1.11:3002"
echo "   Local:   http://localhost:3002"
echo ""
echo "📡 BACKEND API:"
echo "   Network: http://10.26.1.11:3000"
echo "   Local:   http://localhost:3000"
echo ""
echo "👥 Test Accounts:"
echo "   Dietitian: dr.priya / dietitian123"
echo "   Client: rahul.kumar / client123"
echo ""
echo "🎯 ACCESS THE APPLICATION:"
echo "   👉 http://10.26.1.11:3002 (Frontend)"
echo "   👉 http://10.26.1.11:3000 (Backend API)"
echo ""
echo "📝 Process IDs:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "⌨️ Press Ctrl+C to stop all services"

# Wait for user input
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ Stopped"; exit 0' INT

while true; do
    sleep 1
done