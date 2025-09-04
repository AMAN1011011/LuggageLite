#!/bin/bash

# TravelLite Deployment Script
# Usage: ./scripts/deploy.sh [environment] [version]

set -e

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
PROJECT_NAME="travellite"
DOCKER_REGISTRY="your-registry.com"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker is not running"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if .env file exists
    if [[ ! -f ".env.${ENVIRONMENT}" ]]; then
        log_error "Environment file .env.${ENVIRONMENT} not found"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Load environment variables
load_environment() {
    log_info "Loading environment variables for ${ENVIRONMENT}..."
    
    # Copy environment-specific file
    cp ".env.${ENVIRONMENT}" .env
    
    # Export variables
    export $(cat .env | grep -v '^#' | xargs)
    
    log_success "Environment variables loaded"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Backend tests
    log_info "Running backend tests..."
    cd backend
    npm test -- --coverage --watchAll=false
    cd ..
    
    # Frontend tests
    log_info "Running frontend tests..."
    cd frontend
    npm test -- --coverage --watchAll=false
    cd ..
    
    log_success "All tests passed"
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."
    
    # Build main application image
    docker build -t "${PROJECT_NAME}:${VERSION}" .
    
    # Tag for registry
    if [[ "$ENVIRONMENT" == "production" ]]; then
        docker tag "${PROJECT_NAME}:${VERSION}" "${DOCKER_REGISTRY}/${PROJECT_NAME}:${VERSION}"
        docker tag "${PROJECT_NAME}:${VERSION}" "${DOCKER_REGISTRY}/${PROJECT_NAME}:latest"
    fi
    
    log_success "Docker images built successfully"
}

# Push images to registry (production only)
push_images() {
    if [[ "$ENVIRONMENT" == "production" ]]; then
        log_info "Pushing images to registry..."
        
        docker push "${DOCKER_REGISTRY}/${PROJECT_NAME}:${VERSION}"
        docker push "${DOCKER_REGISTRY}/${PROJECT_NAME}:latest"
        
        log_success "Images pushed to registry"
    fi
}

# Deploy application
deploy_application() {
    log_info "Deploying application..."
    
    # Create backup of current deployment
    if docker-compose ps | grep -q "Up"; then
        log_info "Creating backup of current deployment..."
        docker-compose exec app node scripts/backup.js
    fi
    
    # Pull latest images (production only)
    if [[ "$ENVIRONMENT" == "production" ]]; then
        docker-compose pull
    fi
    
    # Deploy with zero-downtime
    log_info "Starting deployment with zero-downtime strategy..."
    
    # Scale up new instances
    docker-compose up -d --scale app=2
    
    # Health check for new instances
    log_info "Performing health checks..."
    sleep 30
    
    # Check if new instances are healthy
    if ! curl -f http://localhost:5000/api/health; then
        log_error "Health check failed, rolling back..."
        docker-compose down
        exit 1
    fi
    
    # Scale down old instances
    docker-compose up -d --scale app=1
    
    log_success "Application deployed successfully"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Wait for database to be ready
    docker-compose exec app node scripts/wait-for-db.js
    
    # Run migrations
    docker-compose exec app node scripts/migrate.js
    
    log_success "Database migrations completed"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Health check
    if curl -f http://localhost:5000/api/health; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
    
    # API endpoints check
    if curl -f http://localhost:5000/api/stations/popular; then
        log_success "API endpoints check passed"
    else
        log_error "API endpoints check failed"
        exit 1
    fi
    
    # Database connectivity check
    docker-compose exec app node scripts/db-check.js
    
    log_success "Deployment verification completed"
}

# Cleanup old resources
cleanup() {
    log_info "Cleaning up old resources..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove old log files (keep last 7 days)
    find logs/ -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    
    # Get previous version
    PREVIOUS_VERSION=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "${PROJECT_NAME}" | head -2 | tail -1 | cut -d':' -f2)
    
    if [[ -n "$PREVIOUS_VERSION" ]]; then
        log_info "Rolling back to version: ${PREVIOUS_VERSION}"
        
        # Update docker-compose to use previous version
        sed -i "s/${PROJECT_NAME}:${VERSION}/${PROJECT_NAME}:${PREVIOUS_VERSION}/g" ${COMPOSE_FILE}
        
        # Deploy previous version
        docker-compose up -d
        
        # Verify rollback
        if curl -f http://localhost:5000/api/health; then
            log_success "Rollback completed successfully"
        else
            log_error "Rollback failed"
            exit 1
        fi
    else
        log_error "No previous version found for rollback"
        exit 1
    fi
}

# Send deployment notification
send_notification() {
    local status=$1
    local message="TravelLite deployment to ${ENVIRONMENT} ${status}"
    
    # Send to Slack (if webhook URL is configured)
    if [[ -n "${SLACK_WEBHOOK_URL}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"${message}\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
    
    # Send email notification (if configured)
    if [[ -n "${NOTIFICATION_EMAIL}" ]]; then
        echo "${message}" | mail -s "TravelLite Deployment ${status}" "${NOTIFICATION_EMAIL}"
    fi
}

# Main deployment function
main() {
    log_info "Starting TravelLite deployment to ${ENVIRONMENT} environment"
    log_info "Version: ${VERSION}"
    
    # Trap errors and rollback
    trap 'log_error "Deployment failed"; rollback; send_notification "FAILED"; exit 1' ERR
    
    check_prerequisites
    load_environment
    
    # Skip tests in staging/production if explicitly set
    if [[ "${SKIP_TESTS}" != "true" ]]; then
        run_tests
    fi
    
    build_images
    push_images
    deploy_application
    run_migrations
    verify_deployment
    cleanup
    
    log_success "Deployment completed successfully!"
    send_notification "SUCCESSFUL"
}

# Handle script arguments
case "${1}" in
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        main
        ;;
esac
