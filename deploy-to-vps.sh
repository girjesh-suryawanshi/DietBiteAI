#!/bin/bash

# MyMealify VPS Deployment Script
# This script automates the deployment process to your VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Please create .env file from .env.example and fill in your values"
    print_info "cp .env.example .env"
    exit 1
fi

print_info "Starting MyMealify deployment process..."

# Step 1: Check if Docker is running
print_info "Step 1: Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_info "✅ Docker and Docker Compose are installed"

# Step 2: Stop existing containers
print_info "Step 2: Stopping existing containers (if any)..."
docker compose down || true

# Step 3: Build Docker images
print_info "Step 3: Building Docker images..."
print_warn "This may take several minutes..."
docker compose build --no-cache

# Step 4: Start services
print_info "Step 4: Starting all services..."
docker compose up -d

# Step 5: Wait for services to be healthy
print_info "Step 5: Waiting for services to start..."
sleep 10

# Step 6: Check if services are running
print_info "Step 6: Checking service status..."
docker compose ps

# Step 7: Initialize database
print_info "Step 7: Initializing database..."
docker compose exec -T mymealify-app npm run db:push || print_warn "Database initialization failed or already done"

# Step 8: Display logs
print_info "Step 8: Displaying recent logs..."
docker compose logs --tail=50

# Final status
print_info ""
print_info "========================================="
print_info "🎉 Deployment Complete!"
print_info "========================================="
print_info ""
print_info "Your application is now running at:"
print_info "  - Direct access: http://localhost:3002"
print_info "  - Via Nginx: http://localhost:8080"
print_info ""
print_info "Useful commands:"
print_info "  - View logs: docker compose logs -f"
print_info "  - Stop services: docker compose stop"
print_info "  - Restart services: docker compose restart"
print_info "  - Update app: git pull && ./deploy-to-vps.sh"
print_info ""
print_info "To check the health of your services:"
print_info "  docker compose ps"
print_info ""
