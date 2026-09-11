# Multi-stage build for production-ready Telegram Bot
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies for building)
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source code and build TypeScript to JavaScript
COPY src/ ./src/
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

# Set timezone to Asia/Phnom_Penh (Cambodia UTC+7)
RUN apk add --no-cache tzdata
ENV TZ=Asia/Phnom_Penh

ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript output from builder stage
COPY --from=builder /app/dist ./dist

# Start the bot
CMD ["node", "dist/index.js"]
