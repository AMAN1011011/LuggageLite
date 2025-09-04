#!/bin/bash

# TravelLite Development Setup Script
# Usage: ./scripts/setup.sh

set -e

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

# Check if Node.js is installed
check_node() {
    log_info "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VERSION -lt 18 ]]; then
        log_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    log_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    log_info "Checking npm installation..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "npm $(npm -v) is installed"
}

# Install backend dependencies
install_backend_deps() {
    log_info "Installing backend dependencies..."
    
    cd backend
    npm install
    cd ..
    
    log_success "Backend dependencies installed"
}

# Install frontend dependencies
install_frontend_deps() {
    log_info "Installing frontend dependencies..."
    
    cd frontend
    npm install
    cd ..
    
    log_success "Frontend dependencies installed"
}

# Install development tools
install_dev_tools() {
    log_info "Installing development tools..."
    
    # Install global tools
    npm install -g nodemon concurrently
    
    # Install testing tools
    npm install -g jest cypress
    
    log_success "Development tools installed"
}

# Setup environment files
setup_environment() {
    log_info "Setting up environment files..."
    
    # Backend environment
    if [[ ! -f "backend/.env" ]]; then
        cp backend/.env.example backend/.env
        log_info "Created backend/.env from example"
    fi
    
    # Frontend environment
    if [[ ! -f "frontend/.env" ]]; then
        cp frontend/.env.example frontend/.env
        log_info "Created frontend/.env from example"
    fi
    
    # Root environment files
    if [[ ! -f ".env.development" ]]; then
        cat > .env.development << EOF
# Development Environment Configuration
NODE_ENV=development
API_PORT=5000
FRONTEND_PORT=5173

# Database
MONGODB_URI=mongodb://localhost:27017/travellite_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-for-development

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (Mock in development)
SENDGRID_API_KEY=mock-sendgrid-key

# SMS (Mock in development)
TWILIO_ACCOUNT_SID=mock-twilio-sid
TWILIO_AUTH_TOKEN=mock-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Payment (Mock in development)
RAZORPAY_KEY_ID=mock-razorpay-key
RAZORPAY_KEY_SECRET=mock-razorpay-secret

# Cloud Storage (Mock in development)
CLOUDINARY_CLOUD_NAME=mock-cloud
CLOUDINARY_API_KEY=mock-api-key
CLOUDINARY_API_SECRET=mock-api-secret
EOF
        log_info "Created .env.development"
    fi
    
    if [[ ! -f ".env.test" ]]; then
        cat > .env.test << EOF
# Test Environment Configuration
NODE_ENV=test
API_PORT=5001
FRONTEND_PORT=5174

# Database
MONGODB_URI=mongodb://localhost:27017/travellite_test

# JWT
JWT_SECRET=test-jwt-secret

# All other services use mock values for testing
EOF
        log_info "Created .env.test"
    fi
    
    log_success "Environment files created"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    # Check if MongoDB is installed
    if command -v mongod &> /dev/null; then
        log_info "MongoDB is installed locally"
        
        # Start MongoDB if not running
        if ! pgrep mongod > /dev/null; then
            log_info "Starting MongoDB..."
            mongod --fork --logpath /tmp/mongodb.log --dbpath /tmp/mongodb-data || true
        fi
        
        # Create database and initial data
        mongo travellite_dev --eval "
            db.stations.insertMany([
                {
                    id: '1',
                    name: 'Mumbai Central',
                    code: 'MUM',
                    type: 'railway',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    coordinates: { lat: 19.0760, lng: 72.8777 }
                },
                {
                    id: '2',
                    name: 'New Delhi',
                    code: 'DEL',
                    type: 'railway',
                    city: 'Delhi',
                    state: 'Delhi',
                    coordinates: { lat: 28.6139, lng: 77.2090 }
                }
            ]);
            print('Sample data inserted');
        " || log_warning "Could not insert sample data"
        
    else
        log_warning "MongoDB not found locally. You can use Docker instead:"
        log_info "  docker run -d -p 27017:27017 --name mongodb mongo:6.0"
    fi
    
    log_success "Database setup completed"
}

# Setup Git hooks
setup_git_hooks() {
    log_info "Setting up Git hooks..."
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for TravelLite

# Run linting
echo "Running linting checks..."
cd frontend && npm run lint
cd ../backend && npm run lint

# Run tests
echo "Running tests..."
cd ../frontend && npm test -- --watchAll=false
cd ../backend && npm test

echo "Pre-commit checks passed!"
EOF
    
    chmod +x .git/hooks/pre-commit
    
    log_success "Git hooks configured"
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p temp
    mkdir -p backup
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p monitoring/logstash/pipeline
    mkdir -p nginx/ssl
    
    log_success "Directories created"
}

# Setup VS Code workspace
setup_vscode() {
    log_info "Setting up VS Code workspace..."
    
    cat > .vscode/settings.json << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.workingDirectories": ["frontend", "backend"],
    "jest.jestCommandLine": "npm test --",
    "jest.autoRun": "off",
    "files.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/build": true,
        "**/.git": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/build": true
    }
}
EOF
    
    cat > .vscode/extensions.json << 'EOF'
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-jest",
        "ms-vscode.vscode-typescript-next",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-json"
    ]
}
EOF
    
    log_success "VS Code workspace configured"
}

# Display next steps
show_next_steps() {
    log_success "TravelLite setup completed successfully!"
    echo
    log_info "Next steps:"
    echo "1. Update environment variables in .env files as needed"
    echo "2. Start the development server:"
    echo "   npm run dev"
    echo
    echo "3. Run tests:"
    echo "   npm test"
    echo
    echo "4. Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:5000"
    echo
    echo "5. For production deployment:"
    echo "   ./scripts/deploy.sh production"
    echo
    log_info "Happy coding! 🚀"
}

# Main setup function
main() {
    log_info "Starting TravelLite development environment setup..."
    
    check_node
    check_npm
    create_directories
    install_backend_deps
    install_frontend_deps
    install_dev_tools
    setup_environment
    setup_database
    setup_git_hooks
    setup_vscode
    show_next_steps
}

# Run main function
main
