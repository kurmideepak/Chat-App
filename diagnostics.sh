#!/bin/bash
# Chat App - Diagnostic Script
# Run this to verify your environment is set up correctly

echo "=========================================="
echo "Chat App - Environment Diagnostic"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
FAILURES=0

# Helper function
check_command() {
    local cmd=$1
    local name=$2
    if command -v $cmd &> /dev/null; then
        version=$($cmd --version 2>&1 | head -n 1)
        echo -e "${GREEN}✓${NC} $name installed: $version"
    else
        echo -e "${RED}✗${NC} $name NOT found"
        FAILURES=$((FAILURES + 1))
    fi
}

# Helper function for port check
check_port() {
    local port=$1
    local name=$2
    if nc -zv localhost $port &> /dev/null; then
        echo -e "${GREEN}✓${NC} $name running on port $port"
    else
        echo -e "${RED}✗${NC} $name NOT running on port $port"
        FAILURES=$((FAILURES + 1))
    fi
}

# Check Java
echo "--- CHECKING PREREQUISITES ---"
check_command java "Java"
check_command mvn "Maven"
check_command node "Node.js"
check_command npm "npm"
echo ""

# Check running services
echo "--- CHECKING RUNNING SERVICES ---"
check_port 27017 "MongoDB"
check_port 8080 "Backend"
check_port 5173 "Frontend"
echo ""

# Check .env files
echo "--- CHECKING CONFIGURATION FILES ---"
if [ -f "chat-app-backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env exists"
else
    echo -e "${RED}✗${NC} Backend .env missing"
    FAILURES=$((FAILURES + 1))
fi

if [ -f "frontend-chat/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env exists"
else
    echo -e "${RED}✗${NC} Frontend .env missing"
    FAILURES=$((FAILURES + 1))
fi
echo ""

# Check MongoDB connection
echo "--- CHECKING MONGODB CONNECTION ---"
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB connection successful"
    else
        echo -e "${RED}✗${NC} MongoDB not responding"
        FAILURES=$((FAILURES + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} mongosh not found - cannot test MongoDB"
fi
echo ""

# Check Backend
echo "--- CHECKING BACKEND ---"
if curl -s http://localhost:8080/ | grep -q "Welcome"; then
    echo -e "${GREEN}✓${NC} Backend responding on http://localhost:8080"
else
    echo -e "${RED}✗${NC} Backend not responding"
    FAILURES=$((FAILURES + 1))
fi
echo ""

# Check Frontend
echo "--- CHECKING FRONTEND ---"
if curl -s http://localhost:5173/ | grep -q "<!"; then
    echo -e "${GREEN}✓${NC} Frontend responding on http://localhost:5173"
else
    echo -e "${RED}✗${NC} Frontend not responding"
    FAILURES=$((FAILURES + 1))
fi
echo ""

# Summary
echo "=========================================="
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED${NC}"
    echo "Your chat app is ready to use!"
    echo "Open http://localhost:5173 in your browser"
else
    echo -e "${RED}✗ $FAILURES CHECK(S) FAILED${NC}"
    echo "Please fix the issues above."
    echo "See TROUBLESHOOTING.md for help."
fi
echo "=========================================="
