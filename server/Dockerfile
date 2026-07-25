FROM node:20-alpine

# Install Python, pip, and ffmpeg for yt-dlp
RUN apk add --no-cache python3 py3-pip ffmpeg

# Create a virtual environment and install yt-dlp
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir yt-dlp

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate prisma client
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
