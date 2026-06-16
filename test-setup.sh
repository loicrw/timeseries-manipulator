#!/bin/bash

echo "🧪 Testing Time Series Manipulator Setup"
echo "========================================"
echo ""

# Check Python
echo "1. Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo "   ✅ Python $PYTHON_VERSION installed"
else
    echo "   ❌ Python not found"
    exit 1
fi

# Check Node.js
echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>&1)
    echo "   ✅ Node.js $NODE_VERSION installed"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

# Check uv
echo "3. Checking uv..."
if command -v uv &> /dev/null; then
    UV_VERSION=$(uv --version 2>&1 | awk '{print $2}')
    echo "   ✅ uv $UV_VERSION installed"
else
    echo "   ❌ uv not found"
    exit 1
fi

# Check node_modules
echo "4. Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ⚠️  node_modules not found - run: npm install"
fi

# Check Python venv
echo "5. Checking Python virtual environment..."
if [ -d "server-py/.venv" ]; then
    echo "   ✅ Python .venv exists"
else
    echo "   ℹ️  .venv will be created on first server run"
fi

# Check data files
echo "6. Checking CSV data files..."
DATA_COUNT=$(ls public/data/*.csv 2>/dev/null | wc -l)
if [ $DATA_COUNT -eq 10 ]; then
    echo "   ✅ All 10 CSV files present"
else
    echo "   ⚠️  Expected 10 CSV files, found $DATA_COUNT"
    echo "      Run: python3 generate_data_simple.py"
fi

# Check backend is running
echo "7. Checking backend server..."
if curl -s http://localhost:3001/api/series > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 3001"
else
    echo "   ⚠️  Backend not running"
    echo "      Start with: npm run server"
fi

# Check frontend is running
echo "8. Checking frontend server..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
elif curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5174"
else
    echo "   ⚠️  Frontend not running"
    echo "      Start with: npm run dev"
fi

echo ""
echo "========================================"
echo "📋 Summary:"
echo ""
echo "Prerequisites:    $([ -x "$(command -v python3)" ] && [ -x "$(command -v node)" ] && [ -x "$(command -v uv)" ] && echo '✅' || echo '❌')"
echo "Dependencies:     $([ -d "node_modules" ] && echo '✅' || echo '⚠️')"
echo "Data Files:       $([ $DATA_COUNT -eq 10 ] && echo '✅' || echo '⚠️')"
echo "Backend Running:  $(curl -s http://localhost:3001/api/series > /dev/null 2>&1 && echo '✅' || echo '⚠️')"
echo "Frontend Running: $(curl -s http://localhost:5173 > /dev/null 2>&1 && echo '✅' || curl -s http://localhost:5174 > /dev/null 2>&1 && echo '✅' || echo '⚠️')"
echo ""

# Final recommendation
if curl -s http://localhost:3001/api/series > /dev/null 2>&1 && (curl -s http://localhost:5173 > /dev/null 2>&1 || curl -s http://localhost:5174 > /dev/null 2>&1); then
    echo "🎉 Everything is running! Open http://localhost:5173 in your browser."
else
    echo "🔧 Next steps:"
    if ! curl -s http://localhost:3001/api/series > /dev/null 2>&1; then
        echo "   1. Start backend:  npm run server"
    fi
    if ! curl -s http://localhost:5173 > /dev/null 2>&1 && ! curl -s http://localhost:5174 > /dev/null 2>&1; then
        echo "   2. Start frontend: npm run dev"
    fi
    echo ""
    echo "   See QUICK_START.md for detailed instructions."
fi

echo ""
