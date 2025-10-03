#!/bin/bash

# Quick Update Script for MyMealify
# Use this to quickly update your running application

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}[INFO]${NC} Starting quick update..."

# Pull latest changes
if [ -d .git ]; then
    echo -e "${GREEN}[INFO]${NC} Pulling latest code from Git..."
    git pull origin main
else
    echo -e "${YELLOW}[WARN]${NC} Not a git repository, skipping pull"
fi

# Rebuild and restart
echo -e "${GREEN}[INFO]${NC} Rebuilding containers..."
docker compose build

echo -e "${GREEN}[INFO]${NC} Restarting services..."
docker compose up -d

# Show status
echo -e "${GREEN}[INFO]${NC} Service status:"
docker compose ps

echo -e "${GREEN}[INFO]${NC} ✅ Update complete!"
echo -e "${GREEN}[INFO]${NC} View logs: docker compose logs -f"
