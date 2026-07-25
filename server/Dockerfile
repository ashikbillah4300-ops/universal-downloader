FROM node:20-slim

# Install system dependencies: Python, ffmpeg, and openssl
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp (using --break-system-packages for Debian compatibility)
RUN pip3 install --no-cache-dir yt-dlp --break-system-packages

WORKDIR /app

# Set default port
ENV PORT=8000

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies for the build step
RUN npm install

# Copy the rest of the source code
COPY . .

# Fix permissions for binaries (crucial for Windows to Linux moves)
RUN chmod -R +x node_modules/.bin

# Generate prisma client and build TypeScript
RUN npm run prisma:generate
RUN npm run build

EXPOSE 8000

# Use a shell script to run migrations and then start the server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
