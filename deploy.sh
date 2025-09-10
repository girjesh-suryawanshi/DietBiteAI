#!/bin/bash

# FitBite Docker Deployment Script for Hostinger VPS
# Author: FitBite Team
# Description: Automated deployment script with rollback capability

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="fitbite"
BACKUP_DIR="./backups"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

check_requirements() {
    print_status "Checking system requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f "$ENV_FILE" ]; then
        print_error ".env file not found. Please copy .env.example to .env and configure it."
        exit 1
    fi
    
    print_success "System requirements check passed"
}

backup_data() {
    print_status "Creating backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Create timestamp
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
    
    # Backup volumes and configuration
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T fitbite-app tar -czf - /app/server/temp > "$BACKUP_FILE" 2>/dev/null || true
    
    # Backup environment file
    cp "$ENV_FILE" "$BACKUP_DIR/.env_$TIMESTAMP"
    
    print_success "Backup created: $BACKUP_FILE"
    
    # Keep only last 5 backups
    ls -t "$BACKUP_DIR"/backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || true
}

pull_latest_code() {
    print_status "Pulling latest code from repository..."
    
    if [ -d ".git" ]; then
        # Configure git to handle divergent branches
        git config pull.rebase false 2>/dev/null || true
        
        # Try to pull with merge strategy
        git pull origin main || {
            print_warning "Git pull failed. Trying to reset to remote..."
            git fetch origin main && git reset --hard origin/main || {
                print_warning "Could not update code. Continuing with existing code..."
            }
        }
    else
        print_warning "Not a git repository. Skipping code update."
    fi
}

build_and_deploy() {
    print_status "Building and deploying application..."
    
    # Pull base images
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Build the application
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    # Stop existing containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Start new containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    print_success "Application deployed successfully"
}

health_check() {
    print_status "Performing health check..."
    
    # Wait for application to start
    sleep 30
    
    # Check if containers are running
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        print_success "Containers are running"
    else
        print_error "Some containers failed to start"
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs
        return 1
    fi
    
    # Check application health endpoint
    HEALTH_URL="http://localhost:3001/health"
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        print_success "Health check passed"
    else
        print_warning "Health check endpoint not responding. Check logs for details."
        return 1
    fi
}

rollback() {
    print_status "Rolling back to previous version..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.tar.gz | head -n 1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        print_error "No backup found for rollback"
        exit 1
    fi
    
    # Stop current containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Restore backup
    docker-compose -f "$DOCKER_COMPOSE_FILE" run --rm fitbite-app tar -xzf - -C / < "$LATEST_BACKUP"
    
    # Start containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    print_success "Rollback completed"
}

cleanup_old_images() {
    print_status "Cleaning up old Docker images..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove dangling volumes
    docker volume prune -f
    
    print_success "Cleanup completed"
}

show_logs() {
    print_status "Showing application logs..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f --tail=100
}

show_status() {
    print_status "Application Status:"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    
    print_status "Resource Usage:"
    docker stats --no-stream $(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q)
}

# Main deployment function
deploy() {
    print_status "Starting FitBite deployment..."
    
    check_requirements
    backup_data
    pull_latest_code
    build_and_deploy
    
    if health_check; then
        cleanup_old_images
        print_success "Deployment completed successfully! 🎉"
        print_status "Application is running at: http://localhost:80"
        print_status "Use './deploy.sh status' to check application status"
        print_status "Use './deploy.sh logs' to view logs"
    else
        print_error "Deployment failed health check. Consider rolling back."
        print_status "Use './deploy.sh rollback' to rollback to previous version"
        exit 1
    fi
}

# Script usage
usage() {
    echo "Usage: $0 [OPTION]"
    echo "Options:"
    echo "  deploy    - Deploy the application (default)"
    echo "  rollback  - Rollback to previous version"
    echo "  logs      - Show application logs"
    echo "  status    - Show application status"
    echo "  stop      - Stop the application"
    echo "  start     - Start the application"
    echo "  restart   - Restart the application"
    echo "  cleanup   - Clean up old Docker images"
    echo "  help      - Show this help message"
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    stop)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        print_success "Application stopped"
        ;;
    start)
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
        print_success "Application started"
        ;;
    restart)
        docker-compose -f "$DOCKER_COMPOSE_FILE" restart
        print_success "Application restarted"
        ;;
    cleanup)
        cleanup_old_images
        ;;
    help)
        usage
        ;;
    *)
        print_error "Invalid option: $1"
        usage
        exit 1
        ;;
esac