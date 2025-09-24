#!/bin/bash

# 🚀 Playwright Framework Setup Script
# This script automates the initial setup process for the Playwright automation framework

set -e  # Exit on any error

echo "🎭 Setting up Playwright Automation Framework..."
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_step "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
fi

# Install dependencies
print_step "Installing Node.js dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Install Playwright browsers
print_step "Installing Playwright browsers..."
if npx playwright install --with-deps; then
    print_success "Playwright browsers installed successfully"
else
    print_warning "Failed to install Playwright browsers. You can run 'npm run install:browsers' later."
fi

# Setup environment file
print_step "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please edit .env file with your actual credentials before running tests"
    else
        print_error ".env.example file not found"
        exit 1
    fi
else
    print_warning ".env file already exists, skipping creation"
fi

# Create logs directory if it doesn't exist
print_step "Setting up directories..."
mkdir -p logs
mkdir -p test-results
mkdir -p playwright-report
mkdir -p allure-results
print_success "Directories created"

# Check if Java is installed (needed for Allure reports)
print_step "Checking Java installation (for Allure reports)..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_success "Java found: $JAVA_VERSION"
else
    print_warning "Java not found. Install Java to use Allure reports:"
    echo "  macOS: brew install openjdk"
    echo "  Ubuntu: sudo apt install openjdk-11-jdk"
    echo "  Windows: Download from https://www.oracle.com/java/technologies/downloads/"
fi

# Display setup completion and next steps
echo ""
echo "🎉 Setup completed successfully!"
echo "================================="
echo ""
print_step "Next steps:"
echo "1. Edit the .env file with your actual credentials:"
echo "   nano .env  # or use your preferred editor"
echo ""
echo "2. Run tests to verify setup:"
echo "   npm test                    # Run all tests"
echo "   npm run test:headed         # Run with browser UI"
echo "   npm run test:debug          # Run in debug mode"
echo ""
echo "3. Generate reports:"
echo "   npm run report:html         # HTML report"
echo "   npm run report:allure       # Allure report (requires Java)"
echo ""
echo "📚 Documentation:"
echo "   README.md                   # Main documentation"
echo "   docs/SECRETS_SETUP.md       # GitHub secrets setup"
echo ""
print_success "Happy testing! 🧪✨"