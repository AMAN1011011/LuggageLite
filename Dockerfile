# Multi-stage build for TravelLite application

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ .

# Build frontend for production
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source
COPY backend/ .

# Stage 3: Production image
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    curl \
    tini \
    dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S travellite && \
    adduser -S travellite -u 1001

# Copy backend from builder
COPY --from=backend-builder --chown=travellite:travellite /app/backend ./backend

# Copy built frontend
COPY --from=frontend-builder --chown=travellite:travellite /app/frontend/dist ./frontend/dist

# Create necessary directories
RUN mkdir -p logs uploads temp && \
    chown -R travellite:travellite logs uploads temp

# Switch to non-root user
USER travellite

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "backend/api-server.js"]

# Labels
LABEL maintainer="TravelLite Team <dev@travellite.com>"
LABEL version="1.0.0"
LABEL description="TravelLite - Luggage Transportation Service"
