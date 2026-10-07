# ==========================================
# Multi-stage Dockerfile for Employee Management Web App
# ==========================================

# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency specifications
COPY package*.json tsconfig.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code and build TypeScript
COPY src/ ./src/
RUN npm run build

# 2. Production Runtime Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy compiled JavaScript distribution
COPY --from=builder /app/dist ./dist

# Copy static frontend assets and SQL migrations
COPY src/client ./src/client
COPY src/styles ./src/styles
COPY migrations ./migrations

EXPOSE 3000

# Run migrations on container boot, then launch the Express server
CMD ["npm", "run", "start:migrate"]
