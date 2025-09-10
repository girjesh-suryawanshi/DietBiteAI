# Multi-stage build for FitBite
# Stage 1: Build the client and server
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application with fixed import.meta.dirname
RUN npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --define:import.meta.dirname='"/app"'

# Stage 2: Production image
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fitbite -u 1001

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for proper bundling)
RUN npm ci && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy static files to the location the server expects
# The server code expects to find 'public' directory relative to current working directory
COPY --from=builder /app/dist/public ./public

# Create temp directory for PDF generation
RUN mkdir -p server/temp

# Fix ownership before switching to non-root user
RUN chown -R fitbite:nodejs /app

# Change to non-root user
USER fitbite

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]