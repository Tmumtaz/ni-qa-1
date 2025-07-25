#!/bin/bash

# Test script for NI QAE project
echo "=== NI QAE Project Test Runner ==="
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if we're in the right directory
if [ ! -d "api" ] || [ ! -d "ui" ]; then
    echo "❌ Please run this script from the root of the ni-qae project directory"
    exit 1
fi

echo ""
echo "=== Installing Dependencies ==="

# Install API dependencies
echo "Installing API dependencies..."
cd api
if npm install > /dev/null 2>&1; then
    echo "✅ API dependencies installed"
else
    echo "❌ Failed to install API dependencies"
    exit 1
fi

# Install UI dependencies
echo "Installing UI dependencies..."
cd ../ui
if npm install > /dev/null 2>&1; then
    echo "✅ UI dependencies installed"
else
    echo "❌ Failed to install UI dependencies"
    exit 1
fi

cd ..

echo ""
echo "=== Running Tests ==="

# Run UI tests
echo "Running UI tests..."
cd ui
if npm test -- --watchAll=false > /dev/null 2>&1; then
    echo "✅ UI tests passed"
else
    echo "⚠️  Some UI tests failed (this may be intentional for QA testing)"
fi

cd ..

echo ""
echo "=== Health Checks ==="

# Check if API server is already running
echo "Checking API server status..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ API server already running and healthy"
else
    # Start API server in background for health check
    echo "Starting API server for health check..."
    cd api
    node server.js &
    API_PID=$!
    cd ..

    # Wait for server to start
    sleep 3

    # Check API health
    if curl -s http://localhost:3001/health > /dev/null; then
        echo "✅ API server health check passed"
    else
        echo "❌ API server health check failed"
    fi

    # Kill the API server
    kill $API_PID > /dev/null 2>&1
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd api && npm start"
echo "2. Terminal 2: cd ui && npm start"
echo "3. Open browser to http://localhost:3000"
echo ""
echo "API will be available at: http://localhost:3001"
echo "Frontend will be available at: http://localhost:3000"
echo ""
echo "For testing guidance, see QA_TESTING_GUIDE.md"
